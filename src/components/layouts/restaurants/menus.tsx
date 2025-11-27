import { useEffect, useState } from "react";
import { LocalStorageKey } from "../../../utils/constants";
import { getApi, postApi } from "../../../utils/api";
import type { ListMenuItemsRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import { rounded_button } from "../../../utils/csstags";
import { Trash2, Plus, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-white border-r border-slate-200 dark:border-slate-700";
const td: string = "p-4 border-r border-slate-200 dark:border-slate-700 w-sm";
const td_span: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";
const parent_div: string =
  "bg-white/80 bg-slate-800 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 m-3 border border-slate-200/50 dark:border-slate-700/50";

const action_button: string =
  "relative w-full p-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

function Menus() {
  const [menuItems, setMenuItems] = useState<ListMenuItemsRes[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  useEffect(() => {
    fetchMenuItemsByRestaurant();
  }, [page]);

  const fetchMenuItemsByRestaurant = async () => {
    try {
      const restaurantPID = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      const endpoint: string =
        EndPoint.ListMenuItemsByRestaurant + restaurantPID + "?page=" + page;
      const res = await getApi<ListMenuItemsRes[]>(endpoint);

      setMenuItems(res.data);
    } catch {
      console.log("");
    }
  };

  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const unixToString = (unixValue: number) => {
    const date = new Date(unixValue * 1000);
    return date.toISOString().split("T")[0];
  };

  const deleteMenuItem = async (itemPID: string) => {
    try {
      const res = await postApi(EndPoint.DeleteMenuItems + itemPID);
      if (res.status_code === 200) {
        toast.success(res.message);
        fetchMenuItemsByRestaurant();
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log("");
    }
  };

  const editMenuItem = (menu: ListMenuItemsRes) => {
    navigate("/dashboard/menu/create", { state: { menu } });
  };

  return (
    <>
      {menuItems.length > 0 ? (
        <div className={parent_div}>
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Menu Items
                </h3>
              </div>
              <button
                className={`${rounded_button} cursor-pointer`}
                onClick={() => navigate("/dashboard/menu/create")}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
          </div>

          <div className="overflow-auto max-h-[calc(600px-80px)]">
            <table className="w-full">
              <thead className="border-b border-slate-300 dark:border-slate-700">
                <tr>
                  <th className={th_class}>ID</th>
                  <th className={th_class}> Menu Name </th>
                  <th className={th_class}> Description </th>
                  <th className={th_class}> Category </th>
                  <th className={th_class}> Price </th>
                  <th className={th_class}> Is Veg </th>
                  <th className={th_class}> Is Available </th>
                  <th className={th_class}> Preparation Time</th>
                  <th className={th_class}> Created At</th>
                  <th className={th_class}> Action </th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((menu, index) => (
                  <tr
                    className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
          hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    key={menu.pid}
                  >
                    <td className={td}>
                      <span className={td_span}>{index + 1}</span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.name ? menu.name : "NA"}
                      </span>
                    </td>

                    <td className={td}>
                      <span className={td_span}>
                        {menu?.description ? menu.description : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.category_name ? menu.category_name : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.price ? `₹ ${menu.price}` : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.is_veg === true
                          ? "Veg"
                          : menu?.is_veg === false
                            ? "Non Veg"
                            : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.is_available === true
                          ? "Yes"
                          : menu?.is_available === false
                            ? "No"
                            : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.preparation_time
                          ? `${menu.preparation_time} Min`
                          : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {unixToString(menu.created_at)}
                      </span>
                    </td>
                    <td className={td}>
                      <div className="flex  items-center">
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            editMenuItem(menu);
                          }}
                        >
                          <span className="flex  justify-center cursor-pointer">
                            <PencilIcon className="w-5 h-5 text-green-600" />
                          </span>
                        </button>
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(menu.pid);
                            setShowConfirm(true);
                          }}
                        >
                          <span className="flex  justify-center cursor-pointer">
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </span>
                        </button>
                      </div>
                    </td>
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
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this item?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      deleteMenuItem(selectedItemId);
                      setShowConfirm(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={parent_div}>
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <h1 className="text-white dark:text-white font-semibold">
                Menu Items
              </h1>
              <button
                className={`${rounded_button} cursor-pointer`}
                onClick={() => navigate("/dashboard/menu/create")}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
            <span className="text-sm font-medium dark:text-red-300">
              Data not available
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default Menus;
