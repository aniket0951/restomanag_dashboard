import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  User,
  Hash,
  Clock,
  CalendarCheck,
  Loader2,
  ChevronDown,
} from "lucide-react";

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
  const navigate = useNavigate();
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

  const onSubmit = async (data: UpdateAttendaceForm) => {
    console.log("Submit: ", data);
  };

  const onUpdate = async (data: UpdateAttendaceForm) => {
    console.log("Update: ", data);
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {itemMenuForUpdate ? "Update Attendance" : "Mark Attendance"}
              </h1>
              <p className="text-sm text-slate-400">
                {itemMenuForUpdate
                  ? "Modify attendance record"
                  : "Record employee attendance for today"}
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
          {/* Employee Info Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Employee Information</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Employee Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    placeholder="Employee name"
                    disabled={true}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 placeholder-slate-500 focus:outline-none cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              {/* Employee Code */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Employee Code
                </label>
                <div className="relative">
                  <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("empl_code", {
                      required: "Employee code is required",
                    })}
                    type="text"
                    placeholder="Employee code"
                    disabled={true}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 placeholder-slate-500 focus:outline-none cursor-not-allowed opacity-75"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Details Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Attendance Details</h2>
            </div>

            <div className="grid gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Attendance Status <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CalendarCheck className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                  <select
                    {...register("attendance_status", {
                      required: "Status is required",
                    })}
                    className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">Select status</option>
                    <option value="present" className="bg-slate-800">Present</option>
                    <option value="absent" className="bg-slate-800">Absent</option>
                    <option value="late" className="bg-slate-800">Late</option>
                    <option value="Not Logged" className="bg-slate-800">Not Logged</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
                {errors.attendance_status && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.attendance_status.message}
                  </p>
                )}
              </div>

              {/* Time Inputs */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* In Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    In Time <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input
                      {...register("in_time", {
                        required: "In time is required",
                      })}
                      type="time"
                      onClick={(e) => e.currentTarget.showPicker()}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 cursor-pointer [color-scheme:dark]"
                    />
                  </div>
                  {errors.in_time && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {errors.in_time.message}
                    </p>
                  )}
                </div>

                {/* Out Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Out Time <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                    <input
                      {...register("out_time", {
                        required: "Out time is required",
                      })}
                      type="time"
                      onClick={(e) => e.currentTarget.showPicker()}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 cursor-pointer [color-scheme:dark]"
                    />
                  </div>
                  {errors.out_time && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {errors.out_time.message}
                    </p>
                  )}
                </div>
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
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{itemMenuForUpdate ? "Updating..." : "Saving..."}</span>
                </>
              ) : (
                <span>{itemMenuForUpdate ? "Update Attendance" : "Save Attendance"}</span>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Attendance records help track employee work hours and generate reports
        </p>
      </div>
    </div>
  );
}

export default CreateUpdateAttendance;
