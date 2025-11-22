import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { rounded_button } from "../../../utils/csstags";
import type { ListCategoriesRes } from "../../../types/restaurant";
import { getApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import { LocalStorageKey } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-white border-r border-slate-200 dark:border-slate-700";
const td: string = "p-4 border-r border-slate-200 dark:border-slate-700";
const td_span: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";
const parent_div: string =
  "bg-white/80 bg-slate-800 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 m-3 border border-slate-200/50 dark:border-slate-700/50";

function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ListCategoriesRes[]>([]);
  const [page, setPage] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const restaurant_pid = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      const endpoint =
        EndPoint.ListMenuCategoriesByRestaurant +
        restaurant_pid +
        "?page=" +
        page;
      const res = await getApi<ListCategoriesRes[]>(endpoint);
      setCategories(res.data);
    } catch (err) {
      console.log("Error fetching categories : ", err);
    }
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [page, fetchCategories]);

  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  return (
    <>
      {categories.length > 0 ? (
        <div className={parent_div}>
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Menu Categories
                </h3>
              </div>
              <button
                className={`${rounded_button} cursor-pointer`}
                onClick={() => navigate("/dashboard/categories/create")}
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
                  <th className={th_class}> Category Name </th>
                  <th className={th_class}> Description </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((restaurant, index) => (
                  <tr
                    className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
          hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    key={restaurant.pid}
                  >
                    <td className={td}>
                      <span className={td_span}>{index + 1}</span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>{restaurant.name}</span>
                    </td>

                    <td className={td}>
                      <span className={td_span}>{restaurant.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end p-1 border-t border-slate-200/50 dark:border-slate-700/50">
            <span className="text-sm text-slate-600 dark:text-slate-300 m-3">
              Page {page}
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
      ) : (
        <div className={parent_div}>
          <div className="p-3.5">
            <h1 className="text-white dark:text-white font-semibold">
              Menu Categories
            </h1>
            <span className="text-sm font-medium dark:text-red-300">
              Data not available
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;
