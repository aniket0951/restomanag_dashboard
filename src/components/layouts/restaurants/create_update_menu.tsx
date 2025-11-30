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
import { form_class } from "../../../utils/csstags";
import { useEffect, useState } from "react";

const form_label: string =
  "block mb-2.5 text-sm font-black text-heading dark:text-white";

const form_input: string =
  "block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-gray-400 dark:text-gray-400 outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm";

const create_update_button: string =
  "flex justify-center items-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-500 hover:shadow-lg active:scale-95 transition-all duration-300 mt-4 cursor-pointer w-sm text-center disabled:opacity-50 font-black";

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
  const naviaget = useNavigate();
  const [menuCategoryNames, setMenuCategoryNames] = useState<
    ListMenuCategoryNameByRestaurantRes[]
  >([]);
  const [itemMenuForUpdate, setItemMenuForUpdate] = useState(false);
  const { state } = useLocation();
  const stateMenu = state?.menu;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryMenuItemForm>({});

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

      toast.success(res.message);
      naviaget("/dashboard/menu");
    } catch {
      console.log("Error creating");
    }
  };

  useEffect(() => {
    if (stateMenu != null && stateMenu != "undefined") {
      console.log("Having value...", stateMenu);
      setValue("category_pid", stateMenu.category_pid);
      setValue("name", stateMenu.name);
      setValue("description", stateMenu.description);
      setValue("price", stateMenu.price);
      setValue("is_veg", stateMenu.is_veg);
      setValue("is_available", stateMenu.is_available);
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
      setMenuCategoryNames(res.data);
    } catch {
      console.log("Error ");
    }
  };

  const updateMenuItems = async (data: CategoryMenuItemForm) => {
    try {
      const res = await postApi<UpdateMenuItemsRes>(
        EndPoint.UpdateMenuItems,
        data,
      );
      if (res.status_code === 200) {
        toast.success(res.status);
        naviaget("/dashboard/menu");
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log("Error");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={
          itemMenuForUpdate
            ? handleSubmit(updateMenuItems)
            : handleSubmit(onSubmit)
        }
        className={`${form_class} max-w-3xl mx-auto`}
      >
        <div>
          <h1 className="text-gray-400 dark:text-gray-400 font-black">
            Create New Menu Item
          </h1>
          <div className="relative z-0 p-3">
            <label className={form_label}>Menu Name</label>
            <input
              {...register("name", {
                required: "Name is required",
              })}
              type="text"
              className={form_input}
              placeholder="enter menu category like, Desserts,Pasta / Noodles"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="relative z-0 p-3">
            <label className={form_label}>Menu Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className={`${form_input} h-32 resize-none`}
              placeholder="Write description..."
            ></textarea>
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex justify-self">
            <div className="relative z-0 p-3">
              <label className={form_label}>Price</label>
              <input
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                type="number"
                className={form_input}
                placeholder="₹ 123"
              />
              {errors.price && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="relative z-0 p-3">
              <label className={form_label}>Half Price</label>
              <input
                {...register("half_price", {
                  required: "Half-Price is required",
                  valueAsNumber: true,
                })}
                type="number"
                className={form_input}
                placeholder="₹ 123"
              />
              {errors.price && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="relative z-0 p-3">
              <label className={form_label}>
                Preparation Time [In Minutes]
              </label>
              <input
                {...register("preparation_time", {
                  required: "Preparation time is required",
                  valueAsNumber: true,
                })}
                type="number"
                className={form_input}
                placeholder="enter in minutes"
              />
              {errors.preparation_time && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.preparation_time.message}
                </p>
              )}
            </div>
          </div>

          {/* IsVeg and IsAvailable */}
          <div className="flex justify-self-start">
            <div className="relative z-0 p-3">
              <label className={form_label}>Is Veg</label>

              <div
                className="flex items-center cursor-pointer select-none"
                onClick={() => setValue("is_veg", !watch("is_veg"))}
              >
                <div
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                    watch("is_veg") ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                      watch("is_veg") ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>

                <span className="ml-3 text-sm font-medium text-white dark:text-white">
                  {watch("is_veg") ? "Veg" : "Non-Veg"}
                </span>
              </div>

              <input
                type="checkbox"
                {...register("is_veg")}
                className="hidden"
              />
            </div>

            <div className="relative z-0 p-3">
              <label className={form_label}>Is Available</label>
              <input
                {...register("is_available", {
                  required: false,
                })}
                type="checkbox"
                className="w-4 h-4 accent-green-600 cursor-pointer"
              />
              {errors.is_available && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.is_available.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-0 p-3">
          <label className={form_label}>Menu Category</label>

          <select
            {...register("category_pid", {
              required: "Please select category",
            })}
            className={`${form_input} w-sm`}
          >
            <option value="">Select a category name</option>

            {menuCategoryNames.map((category) => (
              <option key={category.pid} value={category.pid}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_pid && (
            <p className="text-red-400 text-xs mt-1">
              {errors.category_pid.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          {itemMenuForUpdate ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className={create_update_button}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={create_update_button}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateMenuItems;
