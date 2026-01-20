import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  UtensilsCrossed,
  Store,
  MapPin,
  ChefHat,
  Leaf,
  Drumstick,
  Calendar,
  Search,
  Building2,
} from "lucide-react";
import { getApi, postApi } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import type { ListRestaurantsRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { LocalStorageKey } from "../../../utils/constants";
import type { Restaurant as restaurantInterface } from "../../../store/user_store";
import { unixToString } from "../../../utils/utils";
import { restaurantStore } from "../../../store/user_store";
import type { CreateOwnerLastActivityRes } from "../../../types/auth";

const getFoodTypeConfig = (foodType: string) => {
  const lower = foodType?.toLowerCase() || "";
  if (lower.includes("veg") && !lower.includes("non")) {
    return {
      icon: Leaf,
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
    };
  }
  if (lower.includes("non")) {
    return {
      icon: Drumstick,
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
    };
  }
  return {
    icon: ChefHat,
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  };
};

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
      if (res.status_code === 200 && Array.isArray(res.data) && res.data.length > 0) {
        setRestaurants(res.data);
      } else {
        setRestaurants([]);
      }
    } catch (err) {
      console.error(err);
      setRestaurants([]);
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
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Restaurants</h3>
                <p className="text-xs text-slate-400">
                  {restaurants.length} restaurants found
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200"
              onClick={() => createRestaurant()}
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {restaurants.length > 0 ? (
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
                      Restaurant
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Cuisine
                    </th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Food Type
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
                  {restaurants.map((restaurant, index) => {
                    const foodTypeConfig = getFoodTypeConfig(
                      restaurant.food_type
                    );
                    const FoodIcon = foodTypeConfig.icon;
                    return (
                      <tr
                        onClick={() => displayRestaurantDetails(restaurant.pid)}
                        className={`cursor-pointer border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                        key={restaurant.pid}
                      >
                        <td className="py-4 px-4">
                          <span className="text-slate-500 text-sm">
                            {(page - 1) * 10 + index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-100">
                                {restaurant.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                ID: {restaurant.pid.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-sm text-slate-200">
                                {restaurant.city}
                              </p>
                              <p className="text-xs text-slate-500">
                                {restaurant.state}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            <ChefHat className="w-3 h-3" />
                            {restaurant.cuisine || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${foodTypeConfig.bg} ${foodTypeConfig.text} border ${foodTypeConfig.border}`}
                          >
                            <FoodIcon className="w-3 h-3" />
                            {restaurant.food_type || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-sm">
                              {unixToString(restaurant.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {/* Edit Restaurant */}
                            <button
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                editRestaurant(restaurant);
                              }}
                              title="Edit Restaurant"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Switch Restaurant */}
                            <button
                              className="p-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                switchRestaurant(restaurant);
                              }}
                              title="Switch to this Restaurant"
                            >
                              <UtensilsCrossed className="w-4 h-4" />
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
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg text-sm text-white font-medium shadow-lg shadow-orange-500/25 transition-all duration-200"
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
                <Store className="w-10 h-10 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-300 font-medium">
                  No restaurants found
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {page > 1
                    ? "No more restaurants on this page"
                    : "Get started by adding your first restaurant"}
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 mt-2"
                  onClick={() => createRestaurant()}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Restaurant</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
