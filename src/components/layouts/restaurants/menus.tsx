import { useEffect, useState } from "react";
import { LocalStorageKey } from "../../../utils/constants";
import { getApi, postApi } from "../../../utils/api";
import type { ListMenuItemsRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import {
  Trash2,
  Plus,
  PencilIcon,
  UtensilsCrossed,
  Search,
  Leaf,
  Drumstick,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  IndianRupee,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { unixToString } from "../../../utils/utils";

const getVegConfig = (isVeg: boolean | undefined) => {
  if (isVeg === true) {
    return {
      icon: Leaf,
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      label: "Veg",
    };
  }
  if (isVeg === false) {
    return {
      icon: Drumstick,
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      label: "Non Veg",
    };
  }
  return {
    icon: Tag,
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    label: "N/A",
  };
};

const getAvailabilityConfig = (isAvailable: boolean | undefined) => {
  if (isAvailable === true) {
    return {
      icon: CheckCircle,
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      label: "Available",
    };
  }
  if (isAvailable === false) {
    return {
      icon: XCircle,
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      label: "Unavailable",
    };
  }
  return {
    icon: Tag,
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    label: "N/A",
  };
};

type Params = {
  restaurantID: string | null;
};

function Menus({ restaurantID }: Params) {
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
      let restaurant_pid: string = "";

      if (
        restaurantID != "" &&
        restaurantID != null &&
        restaurantID != undefined
      ) {
        restaurant_pid = restaurantID;
      } else {
        restaurant_pid =
          localStorage.getItem(LocalStorageKey.CurrentRestaurant) ?? "";
      }

      const endpoint: string =
        EndPoint.ListMenuItemsByRestaurant + restaurant_pid + "?page=" + page;
      const res = await getApi<ListMenuItemsRes[]>(endpoint);

      if (res.status_code === 200 && Array.isArray(res.data) && res.data.length > 0) {
        setMenuItems(res.data);
      } else {
        setMenuItems([]);
      }
    } catch {
      setMenuItems([]);
    }
  };

  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
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
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Menu Items</h3>
                <p className="text-xs text-slate-400">
                  {menuItems.length} items found
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200"
              onClick={() => navigate("/dashboard/menu/create")}
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {menuItems.length > 0 ? (
          <>
            {/* Table */}
            <div className="overflow-auto max-h-[calc(600px-80px)]">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 sticky top-0">
                  <tr>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Half Price
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Prep Time
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((menu, index) => {
                    const vegConfig = getVegConfig(menu.is_veg);
                    const VegIcon = vegConfig.icon;
                    const availConfig = getAvailabilityConfig(menu.is_available);
                    const AvailIcon = availConfig.icon;
                    return (
                      <tr
                        className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                        key={menu.pid}
                      >
                        <td className="py-4 px-4">
                          <span className="text-slate-500 text-sm">
                            {(page - 1) * 10 + index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                              <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="max-w-[200px]">
                              <p className="text-sm font-medium text-slate-100 capitalize truncate">
                                {menu?.name || "N/A"}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {menu?.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            {menu?.category_name || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {menu?.price || "0"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-slate-300 text-sm font-medium">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {menu?.half_price || "0"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${vegConfig.bg} ${vegConfig.text} border ${vegConfig.border}`}
                          >
                            <VegIcon className="w-3 h-3" />
                            {vegConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${availConfig.bg} ${availConfig.text} border ${availConfig.border}`}
                          >
                            <AvailIcon className="w-3 h-3" />
                            {availConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-sm">
                              {menu?.preparation_time
                                ? `${menu.preparation_time} min`
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-sm">
                              {unixToString(menu.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                editMenuItem(menu);
                              }}
                              title="Edit Item"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemId(menu.pid);
                                setShowConfirm(true);
                              }}
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-sm text-white font-medium shadow-lg shadow-amber-500/25 transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <UtensilsCrossed className="w-10 h-10 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-300 font-medium">No menu items found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {page > 1
                    ? "No more items on this page"
                    : "Get started by adding your first menu item"}
                </p>
              </div>
              {page > 1 ? (
                <button
                  onClick={fecthPreviousCategory}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-xl transition-all duration-200 mt-2"
                >
                  <span>← Go Back</span>
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 mt-2"
                  onClick={() => navigate("/dashboard/menu/create")}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Menu Item</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Delete Menu Item
              </h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex gap-3 p-4 border-t border-white/10 bg-white/5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMenuItem(selectedItemId);
                  setShowConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-red-500/25 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Menus;
