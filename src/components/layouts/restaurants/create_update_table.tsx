import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalStorageKey } from "../../../utils/constants";
import { postApi } from "../../../utils/api";
import type { CreateRestaurantTableRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast/headless";
import {
  ArrowLeft,
  LayoutGrid,
  Hash,
  Users,
  Loader2,
} from "lucide-react";

type CreateRestaurantTableForm = {
  number: string;
  status: string;
  pid: string;
  restaurant_pid: string;
  capacity: number;
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
      setValue("capacity", stateCurrentTable.capacity);
      setItemMenuForUpdate(true);
    }
  }, [setItemMenuForUpdate, setValue, stateCurrentTable]);

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
      console.log("Data : ", data);
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
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {itemMenuForUpdate ? "Update Table" : "Create New Table"}
              </h1>
              <p className="text-sm text-slate-400">
                {itemMenuForUpdate
                  ? "Modify table details"
                  : "Add a new table to your restaurant"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={
            itemMenuForUpdate ? handleSubmit(onUpdate) : handleSubmit(onSubmit)
          }
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden"
        >
          {/* Table Details Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-teal-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Table Details</h2>
            </div>

            <div className="grid gap-6">
              {/* Table Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Table Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("number", {
                      required: "Table number is required",
                    })}
                    type="text"
                    placeholder="e.g., T1, A1, 101"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                  />
                </div>
                {errors.number && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.number.message}
                  </p>
                )}
              </div>

              {/* Table Capacity */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Seating Capacity <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("capacity", {
                      required: "Capacity is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Minimum capacity is 1" },
                      max: { value: 20, message: "Maximum capacity is 20" },
                    })}
                    type="number"
                    min="1"
                    max="20"
                    placeholder="e.g., 2, 4, 6"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                  />
                </div>
                {errors.capacity && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.capacity.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Enter the maximum number of guests this table can accommodate
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 p-6 bg-white/5">
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
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{itemMenuForUpdate ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{itemMenuForUpdate ? "Update Table" : "Create Table"}</span>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Tables help organize your restaurant seating and enable QR code ordering
        </p>
      </div>
    </div>
  );
}

export default CreateUpdateTable;
