import { useEffect, useState } from "react";
import StatusGrid, { OrderStatus } from "../../../dashboard/stats";

import {
  FileText,
  PencilIcon,
  Search,
  Calendar,
  Clock,
  ChefHat,
  CheckCircle,
  XCircle,
  Coffee,
  Hash,
  UserPlus,
} from "lucide-react";
import type {
  CountActiveOrdersByRestaurantAnsStatusRes,
  ListOrdersByRestaurantAndStatusRes,
} from "../../../types/orders";
import { formatOrderId, unixToString } from "../../../utils/utils";
import { restaurantStore } from "../../../store/user_store";
import { getApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import { OrderTags, QueryParams } from "./queryparams";
import type { ListEmplsByRoleAndRestoRes } from "../../../types/empls";
import { EmplRoles } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const FormattedDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl px-4 py-2">
      <Calendar className="w-4 h-4 text-blue-400" />
      <span className="text-sm font-semibold text-slate-200">
        {`${day}/${month}/${year}`}
      </span>
    </div>
  );
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/30",
        icon: Clock,
      };
    case "preparing":
      return {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/30",
        icon: ChefHat,
      };
    case "served":
      return {
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        icon: Coffee,
      };
    case "completed":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        icon: CheckCircle,
      };
    case "cancelled":
      return {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/30",
        icon: XCircle,
      };
    default:
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-400",
        border: "border-slate-500/30",
        icon: Clock,
      };
  }
};

const tabIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  preparing: <ChefHat className="w-4 h-4" />,
  served: <Coffee className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
  completed: <CheckCircle className="w-4 h-4" />,
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
    { key: "pending", label: "Pending", color: "amber" },
    { key: "preparing", label: "Preparing", color: "orange" },
    { key: "served", label: "Served", color: "cyan" },
    { key: "cancelled", label: "Cancelled", color: "red" },
    { key: "completed", label: "Completed", color: "emerald" },
  ];

  const getTabClasses = (tabKey: string, color: string) => {
    const isActive = activeTab === tabKey;
    const colorMap: Record<string, string> = {
      amber: isActive
        ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
        : "text-slate-400 border-transparent hover:bg-amber-500/10 hover:text-amber-400",
      orange: isActive
        ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
        : "text-slate-400 border-transparent hover:bg-orange-500/10 hover:text-orange-400",
      cyan: isActive
        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
        : "text-slate-400 border-transparent hover:bg-cyan-500/10 hover:text-cyan-400",
      red: isActive
        ? "bg-red-500/20 text-red-400 border-red-500/50"
        : "text-slate-400 border-transparent hover:bg-red-500/10 hover:text-red-400",
      emerald: isActive
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
        : "text-slate-400 border-transparent hover:bg-emerald-500/10 hover:text-emerald-400",
    };
    return colorMap[color] || colorMap.amber;
  };

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
    } else {
      setOrders([]);
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
                key={item.status}
                title={item.label}
                count={item.total_count}
                currentPercentage={item.percentage}
              />
            ))
          : null}
      </StatusGrid>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl backdrop-blur-xl overflow-hidden w-full mt-5 border border-white/10 shadow-xl">
        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-300 whitespace-nowrap ${getTabClasses(tab.key, tab.color)}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tabIcons[tab.key]}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                {tabIcons[activeTab]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white capitalize">
                  {activeTab} Orders
                </h3>
                <p className="text-xs text-slate-400">
                  {orders.length} orders found
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-4">
              {FormattedDate()}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[calc(600px-80px)]">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  #
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Table
                </th>
                <th className="text-right py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
                {activeTab === "pending" && (
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Assign
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((item, index) => {
                  const statusConfig = getStatusConfig(item.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr
                      className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                      key={item.pid}
                    >
                      <td className="py-4 px-4">
                        <span className="text-slate-500 text-sm">
                          {(page - 1) * 10 + index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <Hash className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-200">
                            {item?.pid ? formatOrderId(item.pid) : "NA"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-slate-200 text-sm font-medium">
                          {item?.table_no || "NA"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          ₹{item?.total_amount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {item?.status || "NA"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-slate-400">
                          {unixToString(item.created_at)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {activeTab === "completed" ? (
                            <button
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                editAndDisplayOrder(OrderTags.Display, item.pid);
                              }}
                              title="View Details"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editAndDisplayOrder(OrderTags.Edit, item.pid);
                                }}
                                title="Edit Order"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editAndDisplayOrder(OrderTags.Display, item.pid);
                                }}
                                title="View Details"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      {activeTab === "pending" && (
                        <td className="py-4 px-4 text-center">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs font-medium shadow-lg shadow-purple-500/25 transition-all duration-200">
                            <UserPlus className="w-3.5 h-3.5" />
                            Assign
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === "pending" ? 8 : 7}
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-sm">
                        No {activeTab} orders found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
          <span className="text-sm text-slate-400">
            Page <span className="font-medium text-slate-200">{page}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={fecthPreviousCategory}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 rounded-lg text-sm text-slate-300 transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={fecthNextCategory}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-sm text-white font-medium shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
