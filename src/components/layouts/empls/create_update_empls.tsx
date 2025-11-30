import { useForm } from "react-hook-form";
import { form_class } from "../../../utils/csstags";
import { useEffect, useState } from "react";
import { restaurantStore, useUserStore } from "../../../store/user_store";
import { postApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

const form_label: string =
  "block mb-2.5 text-sm font-black text-heading dark:text-white";

const form_input: string =
  "block w-sm mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-gray-400 dark:text-gray-400 outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm";

const create_update_button: string =
  "flex justify-center items-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-500 hover:shadow-lg active:scale-95 transition-all duration-300 mt-4 cursor-pointer w-sm text-center disabled:opacity-50 font-black";

type CreateEmplForm = {
  restaurant_pid: string;
  owner_pid: string;
  name: string;
  email: string;
  contact_number: string;
  role: string;
  joining_date: string;
  empl_code: string;
  pid: string;
};

function CreateUpdateEmpl() {
  const naviaget = useNavigate();
  const [itemMenuForUpdate, setItemMenuForUpdate] = useState(false);
  const userStore = useUserStore((state) => state.user);
  const restaurantstore = restaurantStore((state) => state.restaurant);
  const { state } = useLocation();
  const stateEmpl = state?.empl;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmplForm>({});

  const formatDateForInput = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (stateEmpl != null && stateEmpl != undefined) {
      setValue("restaurant_pid", stateEmpl.restaurant_pid);
      setValue("owner_pid", stateEmpl.owner_pid);
      setValue("name", stateEmpl.name);
      setValue("email", stateEmpl.email);
      setValue("contact_number", stateEmpl.contact_number);
      setValue("empl_code", stateEmpl.empl_code);
      setValue("role", stateEmpl.role);
      setValue("joining_date", formatDateForInput(stateEmpl.joining_date));
      setValue("pid", stateEmpl.pid);
      setItemMenuForUpdate(true);
    }
  }, [stateEmpl, setValue]);

  const onSubmit = async (data: CreateEmplForm) => {
    try {
      const restaurantPID = restaurantstore?.id ?? "NA";
      const ownerID = userStore?.id ?? "NA";
      data.restaurant_pid = restaurantPID;
      data.owner_pid = ownerID;
      data.contact_number = "91" + data.contact_number;
      const res = await postApi(EndPoint.CreateEmpl, data);
      if (res.status_code === 200) {
        toast.success(res.message);
        naviaget("/dashboard/empl");
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log("");
    }
  };

  const onUpdate = async (data: CreateEmplForm) => {
    try {
      const res = await postApi(EndPoint.UpdateEmpl, data);
      if (res.status_code === 200) {
        toast.success(res.message);
        naviaget("/dashboard/empl");
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
            Create New Menu Item
          </h1>
          <div className="relative z-0 p-3">
            <label className={`${form_label}`}>Name</label>
            <input
              {...register("name", {
                required: "Name is required",
              })}
              type="text"
              className={`${form_input} w-sm`}
              placeholder="enter employee name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="relative z-0 p-3">
            <label className={form_label}>Email</label>
            <input
              {...register("email", {
                required: "Email is required",
              })}
              className={`${form_input} w-sm`}
              placeholder="enter email address"
            ></input>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative z-0 p-3">
            <label className={form_label}>Contact Number</label>
            <input
              {...register("contact_number", {
                required: "Contact is required",
              })}
              type="number"
              className={form_input}
              placeholder="8242528811"
            />
            {errors.contact_number && (
              <p className="text-red-400 text-xs mt-1">
                {errors.contact_number.message}
              </p>
            )}
          </div>
          <div className="relative z-0 p-3">
            <label className={form_label}>Role</label>
            <input
              {...register("role", {
                required: "Role is required",
              })}
              type="text"
              className={form_input}
              placeholder="waiter, chef"
            />
            {errors.role && (
              <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>
          <div className="relative z-0 p-3">
            <label className={form_label}>Joining Date</label>
            <input
              {...register("joining_date", {
                required: "Joining date is required",
              })}
              type="date"
              className={`${form_input} cursor-pointer`}
              onClick={(e) => e.currentTarget.showPicker()}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.joining_date && (
              <p className="text-red-400 text-xs mt-1">
                {errors.joining_date.message}
              </p>
            )}
          </div>
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

export default CreateUpdateEmpl;
