import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { form_class } from "../../../utils/csstags";
import { LocalStorageKey } from "../../../utils/constants";
import { postApi } from "../../../utils/api";
import type { CreateRestaurantTableRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast/headless";

const form_label: string =
  "block mb-2.5 text-sm font-black text-heading dark:text-white";

const form_input: string =
  "block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-gray-400 dark:text-gray-400 outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm";

type CreateRestaurantTableForm = {
  number: string;
  status: string;
  pid: string;
  restaurant_pid: string;
};

function CreateUpdateTable() {
  const navigate = useNavigate();
  const [itemMenuForUpdate, setItemMenuForUpdate] = useState(false);
  const { state } = useLocation();
  const stateCurrentTable = state?.currentTable;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRestaurantTableForm>({});

  useEffect(() => {
    if (stateCurrentTable != null && stateCurrentTable != undefined) {
      setValue("number", stateCurrentTable.number);
      setValue("status", stateCurrentTable.status);
      setValue("pid", stateCurrentTable.pid);
      setItemMenuForUpdate(true);
    }
  });

  const onUpdate = async (data: CreateRestaurantTableForm) => {
    try {
      const restaurantPID = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      data.restaurant_pid = restaurantPID ?? "";

      const res = await postApi(EndPoint.UpdateRestaurantTable, data);

      if (res.status_code == 200) {
        toast.success(res.message);
        navigate("/dashboard/table");
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log();
    }
  };

  const onSubmit = async (data: CreateRestaurantTableForm) => {
    try {
      const restaurantPID = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      data.restaurant_pid = restaurantPID ?? "";

      const res = await postApi<CreateRestaurantTableRes>(
        EndPoint.CreateRestaurantTable,
        data,
      );

      if (res.status_code == 200) {
        toast.success(res.message);
        navigate("/dashboard/table");
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
            Create New Table
          </h1>
          <div className="relative z-0 p-5 w-sm">
            <label className={form_label}>Table Number</label>
            <input
              {...register("number", {
                required: "Number is required",
              })}
              type="text"
              className={form_input}
              placeholder="enter table number"
            />
            {errors.number && (
              <p className="text-red-400 text-xs mt-1">
                {errors.number.message}
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

export default CreateUpdateTable;
