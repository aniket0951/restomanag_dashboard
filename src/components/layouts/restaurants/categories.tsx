import { useCallback, useEffect, useState } from "react";
import {
  PencilIcon,
  Plus,
  Trash2,
  FolderOpen,
  Search,
  Calendar,
  Tag,
} from "lucide-react";
import type { ListCategoriesRes } from "../../../types/restaurant";
import { getApi, postApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import { LocalStorageKey } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { unixToString } from "../../../utils/utils";
import toast from "react-hot-toast";

type Params = {
  restaurantID: string | null;
};

function Categories({ restaurantID }: Params) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ListCategoriesRes[]>([]);
  const [page, setPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchCategories = useCallback(async () => {
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

      const endpoint =
        EndPoint.ListMenuCategoriesByRestaurant +
        restaurant_pid +
        "?page=" +
        page;
      const res = await getApi<ListCategoriesRes[]>(endpoint);
      if (res.status_code === 200 && Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.log("Error fetching categories : ", err);
      setCategories([]);
    }
  }, [page, restaurantID]);

  useEffect(() => {
    fetchCategories();
  }, [page, fetchCategories]);

  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const deleteMenuItem = async (menuID: string) => {
    try {
      const res = await postApi(EndPoint.DeleteCategory + menuID);
      toast.success(res.message);
      setPage(1);
      fetchCategories();
    } catch {
      console.log();
    }
  };

  const editMenuItem = (item: ListCategoriesRes) => {
    navigate("/dashboard/categories/create", {
      state: {
        category: item,
      },
    });
  };

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Menu Categories</h3>
                <p className="text-xs text-slate-400">
                  {categories.length} categories found
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200"
              onClick={() => navigate("/dashboard/categories/create")}
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {categories.length > 0 ? (
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
                      Category
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Description
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
                  {categories.map((category, index) => (
                    <tr
                      className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                      key={category.pid}
                    >
                      <td className="py-4 px-4">
                        <span className="text-slate-500 text-sm">
                          {(page - 1) * 10 + index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100 capitalize">
                              {category.name || "N/A"}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {category.pid?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-400 max-w-[300px] truncate">
                          {category.description || "No description"}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-sm">
                            {unixToString(category.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              editMenuItem(category);
                            }}
                            title="Edit Category"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItemId(category.pid);
                              setShowConfirm(true);
                            }}
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg text-sm text-white font-medium shadow-lg shadow-violet-500/25 transition-all duration-200"
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
                <FolderOpen className="w-10 h-10 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-300 font-medium">No categories found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {page > 1
                    ? "No more categories on this page"
                    : "Get started by adding your first category"}
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 mt-2"
                  onClick={() => navigate("/dashboard/categories/create")}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
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
                Delete Category
              </h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete this category? This action cannot
                be undone.
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

export default Categories;
