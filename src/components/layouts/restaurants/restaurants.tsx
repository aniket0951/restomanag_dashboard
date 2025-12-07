import { useEffect } from "react";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Replace,
  UtensilsCrossed,
} from "lucide-react";
import { rounded_button } from "../../../utils/csstags";
import { useState } from "react";
import { getApi, postApi } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

import type { ListRestaurantsRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { LocalStorageKey } from "../../../utils/constants";
import type { Restaurant as restaurantInterface } from "../../../store/user_store";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-white border-r border-slate-200 dark:border-slate-700 hover";

const td: string = "p-2 border-r border-slate-200 dark:border-slate-700";
const td_span: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";

const action_button: string =
  "relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

import { unixToString } from "../../../utils/utils";
import { restaurantStore } from "../../../store/user_store";
import type { CreateOwnerLastActivityRes } from "../../../types/auth";

function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<ListRestaurantsRes[]>([]);
  const [page, setPage] = useState(1);
  const setRestoStore = restaurantStore((state) => state.setRestaurant);

  useEffect(() => {
    fetchRestaurants();
  }, [page]);

  const fetchRestaurants = async () => {
    try {
      const res = await getApi<ListRestaurantsRes[]>(
        EndPoint.ListRestaurant + "?page=" + page,
      );
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const switchRestaurant = async (restaurant: ListRestaurantsRes) => {
    localStorage.setItem(LocalStorageKey.CurrentRestaurant, restaurant.pid);
    const restoInterface: restaurantInterface = {
      id: restaurant.pid,
      name: restaurant.name,
    };
    setRestoStore(restoInterface);
    const requestData = { restaurant_pid: restaurant.pid };
    const res = await postApi<CreateOwnerLastActivityRes>(
      EndPoint.CreateOwnerLastActivity,
      requestData,
    );
    toast.success(res.message);
    navigate("/dashboard");
  };

  const displayRestaurantDetails = (restaurant_id: string) => {
    // localStorage.setItem(LocalStorageKey.CurrentRestaurant, restaurant_id);
    navigate("/dashboard/restaurants/" + restaurant_id);
  };

  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const createRestaurant = () => {
    navigate("/dashboard/restaurants/create");
  };

  const editRestaurant = (restaurant: ListRestaurantsRes) => {
    navigate("/dashboard/restaurants/create", {
      state: { restaurant: restaurant },
    });
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-slate-800 dark:bg-slate-800 backdrop-blur-xl rounded-xl
  border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Restaurants
              </h3>
            </div>
            <button
              className={`${rounded_button} cursor-pointer`}
              onClick={() => createRestaurant()}
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
                <th className={th_class}> Restaurant Name </th>
                <th className={th_class}> State </th>
                <th className={th_class}> City </th>
                <th className={th_class}> Cuisine </th>
                <th className={th_class}> Food Type </th>
                <th className={th_class}> Action</th>
                <th className={th_class}> Created At</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant, index) => (
                <tr
                  onClick={() => displayRestaurantDetails(restaurant.pid)}
                  className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
            hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                  key={restaurant.pid}
                >
                  <td className={td}>
                    <span className={td_span}>{index + 1}</span>
                  </td>
                  <td className={td}>
                    <span className={td_span}>{restaurant.name}</span>
                  </td>

                  <td className={td}>
                    <span className={td_span}>{restaurant.state}</span>
                  </td>
                  <td className={td}>
                    <span className={td_span}>{restaurant.city}</span>
                  </td>

                  <td className={td}>
                    <span className={td_span}>{restaurant.cuisine}</span>
                  </td>
                  <td className={td}>
                    <span className={td_span}>{restaurant.food_type}</span>
                  </td>
                  <td className={td}>
                    <div className="relative group flex items-center justify-between">
                      {/* Edit Restaurant */}
                      <div className="relative group/edit">
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            editRestaurant(restaurant);
                          }}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Switch Restaurant */}
                      <div className="relative group/switch">
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            switchRestaurant(restaurant);
                          }}
                        >
                          <UtensilsCrossed className="w-5 h-5" />
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover/switch:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          Switch Restaurant
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    <span className={td_span}>
                      {unixToString(restaurant.created_at)}
                    </span>
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
    </div>
  );
}

export default Restaurants;
