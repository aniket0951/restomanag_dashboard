import { useForm } from "react-hook-form";
import { form_class } from "../../../utils/csstags";
import { postApi } from "../../../utils/api";
import type { CreateCategoryRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalStorageKey } from "../../../utils/constants";
import { useEffect, useState } from "react";

type CategoryCreateForm = {
  name: string;
  description: string;
  restaurant_pid: string;
  pid: string;
};

const form_label: string =
  "block mb-2.5 text-sm font-black text-heading dark:text-white";

const form_input: string =
  "block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-gray-400 dark:text-gray-400 outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm";

function CreateUpdateCategories() {
  const naviaget = useNavigate();
  const [itemMenuForUpdate, setItemMenuForUpdate] = useState(false);
  const { state } = useLocation();
  const stateCategory = state?.category;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryCreateForm>({});

  useEffect(() => {
    if (stateCategory != null && stateCategory != "undefined") {
      setValue("name", stateCategory.name);
      setValue("description", stateCategory.description);
      setValue("restaurant_pid", stateCategory.restaurant_pid);
      setValue("pid", stateCategory.pid);
      setItemMenuForUpdate(true);
    }
  }, [stateCategory, setValue]);

  const onSubmit = async (data: CategoryCreateForm) => {
    try {
      const restaurantid = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      data.restaurant_pid = restaurantid ?? "";

      const res = await postApi<CreateCategoryRes>(
        EndPoint.CreateMenuCategory,
        data,
      );

      toast.success(res.message);
      naviaget("/dashboard/categories");
    } catch {
      console.log("Error creating");
    }
  };

  const onUpdate = async (data: CategoryCreateForm) => {
    try {
      const res = await postApi(EndPoint.UpdateCategory, data);
      if (res.status_code === 200) {
        toast.success(res.message);
        naviaget("/dashboard/categories");
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log();
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={
          itemMenuForUpdate ? handleSubmit(onUpdate) : handleSubmit(onSubmit)
        }
        className={`${form_class} max-w-3xl mx-auto`}
      >
        <div>
          <h1 className="text-gray-400 dark:text-gray-400 font-black">
            Create New Category
          </h1>
          <div className="relative z-0 p-5">
            <label className={form_label}>Category Name</label>
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
          <div className="relative z-0 p-5">
            <label className={form_label}>Category Description</label>
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
        </div>

        {/* Submit Button */}
        {itemMenuForUpdate ? (
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center py-2 px-4
                bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl
                hover:from-purple-600 hover:to-blue-500 hover:shadow-lg
                active:scale-95 transition-all duration-300 mt-4 cursor-pointer
               w-sm text-center disabled:opacity-50 font-black"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center py-2 px-4
              bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl
              hover:from-purple-600 hover:to-blue-500 hover:shadow-lg
              active:scale-95 transition-all duration-300 mt-4 cursor-pointer
             w-sm text-center disabled:opacity-50 font-black"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateUpdateCategories;
