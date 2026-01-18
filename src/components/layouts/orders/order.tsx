import { useEffect, useState } from "react";
import StatusGrid, { OrderStatus } from "../../../dashboard/stats";

import { FileText, PencilIcon, Search } from "lucide-react";
import type {
  CountActiveOrdersByRestaurantAnsStatusRes,
  ListOrdersByRestaurantAndStatusRes,
} from "../../../types/orders";
import { rounded_button } from "../../../utils/csstags";
import { formatOrderId, unixToString } from "../../../utils/utils";
import { Calendar } from "lucide-react";
import { restaurantStore } from "../../../store/user_store";
import { getApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import { OrderTags, QueryParams } from "./queryparams";
import type { ListEmplsByRoleAndRestoRes } from "../../../types/empls";
import { EmplRoles } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-white border-r border-slate-200 dark:border-slate-700 text-center";
const td: string = "p-4 border-r border-slate-200 dark:border-slate-700 w-sm";
const td_span: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";
const parent_div: string =
  "bg-white/80 bg-slate-800 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 mt-5 border border-slate-200/50 dark:border-slate-700/50";

const action_button: string =
  "relative w-full  p-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

const FormattedDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2">
      <Calendar className="w-4 h-4 text-blue-500" />
      <span className="text-sm font-semibold text-slate-800 dark:text-white">
        {`${day}/${month}/${year}`}
      </span>
    </div>
  );
};

function Orders() {
  const [orders, setOrders] = useState<ListOrdersByRestaurantAndStatusRes[]>(
    [],
  );
  const navigate = useNavigate();
  const [emplLits, setEmplList] = useState<ListEmplsByRoleAndRestoRes[]>([]);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const restaurantstore = restaurantStore((state) => state.restaurant);
  const [activeStatusCounts, setActiveStatusCounts] = useState<
    CountActiveOrdersByRestaurantAnsStatusRes[]
  >([]);

  const fecthNextCategory = () => setPage((p) => p + 1);
  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const tabs = [
    { key: "pending", label: "Pending", color: "#ffc107" },
    { key: "preparing", label: "Preparing", color: "#ff9800" },
    { key: "served", label: "Served", color: "#17a2b8" },
    { key: "cancelled", label: "Cancelled", color: "#dc3545" },
    { key: "completed", label: "Completed", color: "#28a745" },
  ];

  useEffect(() => {
    if (activeStatusCounts.length <= 0) {
      fetchCountActiveOrdersByRestAndStatus();
    }

    if (emplLits.length <= 0) {
      fetchListEmplsByRoleAndResto();
    }
  }, []);

  useEffect(() => {
    fetchOrdersByStatus(activeTab);
  }, [activeTab, page]);

  const fetchOrdersByStatus = async (status: string) => {
    const res = await getApi<ListOrdersByRestaurantAndStatusRes[]>(
      EndPoint.ListOrdersByRestaurantAndStatus,
      {
        [QueryParams.Page]: String(page),
        [QueryParams.Status]: status,
        [QueryParams.RestaurantPID]: restaurantstore?.id
          ? restaurantstore?.id
          : "NA",
      },
    );

    if (res.status_code == 200 && res.data) {
      setOrders(res.data);
    }
  };

  const fetchCountActiveOrdersByRestAndStatus = async () => {
    const res = await getApi<CountActiveOrdersByRestaurantAnsStatusRes[]>(
      EndPoint.CountActiveOrdersByRestaurantAndStatus,
      {
        [QueryParams.RestaurantPID]: restaurantstore?.id,
      },
    );

    if (res.status_code === 200 && res.data) {
      setActiveStatusCounts(res.data);
    }
  };

  const fetchListEmplsByRoleAndResto = async () => {
    const res = await getApi<ListEmplsByRoleAndRestoRes[]>(
      EndPoint.ListEmplByRoleAndResto,
      {
        [QueryParams.Role]: EmplRoles.Waiter,
        [QueryParams.RestaurantPID]: restaurantstore?.id,
      },
    );

    if (res.status_code === 200 && res.data) {
      setEmplList(res.data);
    }
  };

  const editAndDisplayOrder = (tag: string, orderPID: string) => {
    navigate("/dashboard/order/update", {
      state: {
        orderPID: orderPID,
        tag: tag,
      },
    });
  };

  return (
    <div>
      <StatusGrid>
        {activeStatusCounts.length > 0
          ? activeStatusCounts.map((item) => (
              <OrderStatus
                title={item.label}
                count={item.total_count}
                currentPercentage={item.percentage}
              />
            ))
          : null}
      </StatusGrid>

      <div className={parent_div}>
        <div className="flex gap-2.5 mb-5 mt-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`
                            px-6 py-3 text-sm font-medium
                            border-b-[3px] transition-all duration-300
                            ${
                              activeTab === tab.key
                                ? "text-blue-500 font-medium text-lg"
                                : "text-xs text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-400 font-medium"
                            }
                          `}
              onClick={() => setActiveTab(tab.key)}
              style={{
                borderBottomColor:
                  activeTab === tab.key ? tab.color : "transparent",
              }}
            >
              <span className="badge">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                {activeTab ? activeTab : ""}
              </h3>
            </div>
            {/* Search Bar */}
            <div className="flex-1 max-w-md ml-5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders"
                  className="w-full pl-10 pr-20 py-2.5 bg-slate-100 dark:bg-slate-800 border
                  border-slate-200 dark:border-slate-700 rounded-xl text-slate-800
                  dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5
                  bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg
                  transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
            {/* Date Filter  */}
            <div className="flex items-center gap-4 ml-5">
              {FormattedDate()}
            </div>
          </div>
        </div>

        <div className="overflow-auto max-h-[calc(600px-80px)]">
          <table className="w-full">
            <thead className="border-b border-slate-300 dark:border-slate-700">
              <tr>
                <th className={th_class}>ID</th>
                <th className={th_class}> Order ID </th>
                <th className={th_class}> Table No </th>
                <th className={th_class}> Total Amount </th>
                <th className={th_class}> Status </th>
                <th className={th_class}> Created At </th>
                <th className={th_class}> Action </th>
                {activeTab === "pending" ? (
                  <th className={th_class}>Assign</th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr
                  className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
        hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                  key={index}
                >
                  <td className={td}>
                    <span className={td_span}>{index + 1}</span>
                  </td>
                  <td className={td}>
                    <span className={`${td_span} capitalize`}>
                      {item?.pid ? formatOrderId(item.pid) : "NA"}
                    </span>
                  </td>

                  <td className={td}>
                    <span className={td_span}>
                      {item?.table_no ? item.table_no : "NA"}
                    </span>
                  </td>
                  <td className={td}>
                    <span className={td_span}>
                      {item?.total_amount ? "₹ " + item.total_amount : "NA"}
                    </span>
                  </td>
                  <td className={td}>
                    <span
                      className={`${
                        item?.status === "present"
                          ? "text-green-600 dark:text-green-600 "
                          : item?.status === "absent"
                            ? "text-rose-500 dark:text-rose-500"
                            : "text-yellow-500 dark:text-yellow-500"
                      } capitalize ${td_span}`}
                    >
                      {item?.status ? `${item.status}` : "NA"}
                    </span>
                  </td>

                  <td className={td}>
                    <span className={td_span}>
                      {unixToString(item.created_at)}
                    </span>
                  </td>

                  <td className="p-4 border-r border-slate-200 dark:border-slate-700">
                    {activeTab === "completed" ? (
                      <div>
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            editAndDisplayOrder("edit", item.pid);
                          }}
                        >
                          <span className="flex w-10 justify-center cursor-pointer">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex">
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            editAndDisplayOrder(OrderTags.Edit, item.pid);
                          }}
                        >
                          <span className="flex w-10 justify-center cursor-pointer">
                            <PencilIcon className="w-4 h-5 text-green-600" />
                          </span>
                        </button>
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            editAndDisplayOrder(OrderTags.Display, item.pid);
                          }}
                        >
                          <span className="flex w-10 justify-center cursor-pointer">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </span>
                        </button>
                      </div>
                    )}
                  </td>

                  {activeTab == "pending" ? (
                    <td className={td}>
                      <button
                        className={`${action_button} cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 text-lx font-bold`}
                      >
                        Assign Waiter
                      </button>
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end p-1 border-t border-slate-200/50 dark:border-slate-700/50">
          <span className="text-sm text-slate-600 dark:text-slate-300 m-3">
            {page}
          </span>
          <button
            disabled={page === 1}
            onClick={fecthPreviousCategory}
            className="px-4 py-2 m-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-40 cursor-pointer text-white dark:text-white"
          >
            Previous
          </button>

          <button
            onClick={fecthNextCategory}
            className={`${rounded_button} cursor-pointer`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orders;
