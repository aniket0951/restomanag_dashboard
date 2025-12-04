import { useForm } from "react-hook-form";
import { form_class } from "../../../utils/csstags";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const form_label: string =
  "block mb-2.5 text-sm font-black text-heading dark:text-white";

const form_input: string =
  "block w-sm mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-gray-400 dark:text-gray-400 outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm";

const create_update_button: string =
  "flex justify-center items-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-500 hover:shadow-lg active:scale-95 transition-all duration-300 mt-4 cursor-pointer w-sm text-center disabled:opacity-50 font-black";

type UpdateAttendaceForm = {
  pid: string;
  name: string;
  empl_code: string;
  attendance_status: string;
  attendance_date: string;
  in_time: string;
  out_time: string;
};

const convertTo24Hour = (timeString: string | null | undefined): string => {
  if (!timeString) return "";

  // Remove AM/PM and get time part
  const timePart = timeString.replace(/\s*(AM|PM)/i, "").trim();
  const period = timeString.match(/(AM|PM)/i)?.[0]?.toUpperCase();

  const [hours, minutes] = timePart.split(":") as [string, string];
  let hourNum = parseInt(hours, 10);

  // Already in 24-hour format (like "18:00")
  if (hourNum > 12) {
    return `${String(hourNum).padStart(2, "0")}:${minutes}`;
  }

  // Convert 12-hour to 24-hour
  if (period === "PM" && hourNum !== 12) {
    hourNum += 12;
  } else if (period === "AM" && hourNum === 12) {
    hourNum = 0;
  }

  return `${String(hourNum).padStart(2, "0")}:${minutes}`;
};

function CreateUpdateAttendance() {
  // const naviaget = useNavigate();
  const [itemMenuForUpdate, setItemMenuForUpdate] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAttendaceForm>({});
  const { state } = useLocation();
  const stateAttendance = state?.attendance;

  useEffect(() => {
    if (stateAttendance != null && stateAttendance != undefined) {
      setValue("name", stateAttendance.name);
      setValue("empl_code", stateAttendance.empl_code);
      setValue("attendance_status", stateAttendance.attendance_status);
      setValue("attendance_date", stateAttendance.attendance_date);
      setValue("in_time", convertTo24Hour(stateAttendance.in_time));
      setValue("out_time", convertTo24Hour(stateAttendance.out_time));

      setItemMenuForUpdate(true);
    }
  }, [stateAttendance, setValue]);

  const onSubmit = async (data: UpdateAttendaceForm) => {};

  const onUpdate = async (data: UpdateAttendaceForm) => {};

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
            Attendance
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
              disabled={true}
            />
          </div>
          <div className="relative z-0 p-3">
            <label className={form_label}>EmplCode</label>
            <input
              {...register("empl_code", {
                required: "Email is required",
              })}
              className={`${form_input} w-sm`}
              placeholder="enter email address"
              disabled={true}
            ></input>
          </div>
          <div className="relative z-0 p-3">
            <label className={form_label}>Status</label>
            <select
              {...register("attendance_status", {
                required: "Status is required",
              })}
              className={form_input}
            >
              <option value="">Select status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="Not Logged">Not Logged</option>
            </select>
            {errors.attendance_status && (
              <p className="text-red-400 text-xs mt-1">
                {errors.attendance_status.message}
              </p>
            )}
          </div>
          <div className="flex">
            <div className="relative z-0 p-3">
              <label className={form_label}>In Time</label>
              <input
                {...register("in_time", {
                  required: "In Time is required",
                })}
                type="time"
                className="block mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-gray-400 dark:text-gray-400 outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm"
              />
              {errors.in_time && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.in_time.message}
                </p>
              )}
            </div>
            <div className="relative z-0 p-3">
              <label className={form_label}>Out Time</label>
              <input
                {...register("out_time", {
                  required: "Out Time is required",
                })}
                type="time"
                className="block mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-gray-400 dark:text-gray-400 outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm"
              />
              {errors.in_time && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.in_time.message}
                </p>
              )}
            </div>
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

export default CreateUpdateAttendance;
