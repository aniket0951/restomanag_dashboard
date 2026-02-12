import toast from "react-hot-toast";
import type {
  CreateMenuItemsRes,
  ListMenuCategoryNameByRestaurantRes,
  UpdateMenuItemsRes,
} from "../../../types/restaurant";
import { getApi, postApi } from "../../../utils/api";
import { LocalStorageKey } from "../../../utils/constants";
import { EndPoint } from "../../../utils/endpoints";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  UtensilsCrossed,
  FileText,
  IndianRupee,
  Clock,
  Leaf,
  Drumstick,
  CheckCircle,
  XCircle,
  Tag,
  ChevronDown,
  AlignLeft,
} from "lucide-react";

type CategoryMenuItemForm = {
  pid: string;
  name: string;
  description: string;
  price: number;
  half_price: number;
  is_veg: boolean;
  is_available: boolean;
  preparation_time: number;
  restaurant_pid: string;
  category_pid: string;
};

function CreateMenuItems() {
  const navigate = useNavigate();
  const [menuCategoryNames, setMenuCategoryNames] = useState<
    ListMenuCategoryNameByRestaurantRes[]
  >([]);
  const [itemMenuForUpdate, setItemMenuForUpdate] = useState(false);
  const { state } = useLocation();
  const stateMenu = state?.menu;

  const toBoolean = (value: unknown): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    if (typeof value === "number") return value !== 0;
    return Boolean(value);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryMenuItemForm>({
    defaultValues: {
      is_veg: false,
      is_available: false,
    },
  });

  const onSubmit = async (data: CategoryMenuItemForm) => {
    try {
      const restaurantid = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      data.restaurant_pid = restaurantid ?? "";
      const res = await postApi<CreateMenuItemsRes>(
        EndPoint.CreateMenuItems,
        data,
      );

      if (res.status_code === 200) {
        toast.success(res.message);
        navigate("/dashboard/menu");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (stateMenu != null && stateMenu != "undefined") {
      setValue("category_pid", stateMenu.category_pid);
      setValue("name", stateMenu.name);
      setValue("description", stateMenu.description);
      setValue("price", stateMenu.price);
      setValue("is_veg", toBoolean(stateMenu.is_veg));
      setValue("is_available", toBoolean(stateMenu.is_available));
      setValue("preparation_time", stateMenu.preparation_time);
      setValue("restaurant_pid", stateMenu.restaurant_pid);
      setValue("half_price", stateMenu.half_price);
      setValue("pid", stateMenu.pid);
      setItemMenuForUpdate(true);
    }
    fetchListMenuCategoryNameByRestaurant();
  }, [stateMenu, setValue]);

  const fetchListMenuCategoryNameByRestaurant = async () => {
    try {
      const restaurantPID = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      const endpoint =
        EndPoint.ListMenuCategoryNameByRestaurant + restaurantPID;

      const res = await getApi<ListMenuCategoryNameByRestaurantRes[]>(endpoint);
      if (res.status_code === 200 && res.data) {
        setMenuCategoryNames(res.data);
      }
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const updateMenuItems = async (data: CategoryMenuItemForm) => {
    try {
      const res = await postApi<UpdateMenuItemsRes>(
        EndPoint.UpdateMenuItems,
        data,
      );
      if (res.status_code === 200) {
        toast.success(res.message);
        navigate("/dashboard/menu");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const isVeg = watch("is_veg");
  const isAvailable = watch("is_available");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {itemMenuForUpdate ? "Update Menu Item" : "Create Menu Item"}
                </h1>
                <p className="text-sm text-slate-400">
                  {itemMenuForUpdate
                    ? "Update your menu item details"
                    : "Add a new item to your menu"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={
            itemMenuForUpdate
              ? handleSubmit(updateMenuItems)
              : handleSubmit(onSubmit)
          }
          className="p-6 space-y-6"
        >
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Item Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Menu Item Name
                </label>
                <div className="relative">
                  <UtensilsCrossed className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="Enter item name"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <div className="relative">
                  <Tag className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <select
                    {...register("category_pid", { required: "Please select category" })}
                    className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">
                      Select a category
                    </option>
                    {menuCategoryNames.map((category) => (
                      <option key={category.pid} value={category.pid} className="bg-slate-800">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category_pid && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.category_pid.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <div className="relative">
                <AlignLeft className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                <textarea
                  {...register("description", { required: "Description is required" })}
                  placeholder="Describe your menu item..."
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
                />
              </div>
              {errors.description && (
                <p className="text-red-400 text-xs mt-1.5">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Pricing & Time
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Price
                </label>
                <div className="relative">
                  <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Half Price
                </label>
                <div className="relative">
                  <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("half_price", {
                      required: "Half price is required",
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  />
                </div>
                {errors.half_price && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.half_price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Prep Time (mins)
                </label>
                <div className="relative">
                  <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("preparation_time", {
                      required: "Prep time is required",
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="15"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  />
                </div>
                {errors.preparation_time && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.preparation_time.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Item Options
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Is Veg Toggle */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Food Type
                </label>
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setValue("is_veg", !isVeg, { shouldValidate: true })}
                >
                  <div
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      isVeg
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-red-500 to-rose-500"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                        isVeg ? "left-7" : "left-0.5"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {isVeg ? (
                      <>
                        <Leaf className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Vegetarian</span>
                      </>
                    ) : (
                      <>
                        <Drumstick className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Non-Vegetarian</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Is Available Toggle */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Availability
                </label>
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setValue("is_available", !isAvailable, { shouldValidate: true })}
                >
                  <div
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      isAvailable
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-slate-500 to-slate-600"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                        isAvailable ? "left-7" : "left-0.5"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {isAvailable ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-400 font-medium">Not Available</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {itemMenuForUpdate ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{itemMenuForUpdate ? "Update Item" : "Create Item"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMenuItems;
