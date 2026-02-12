import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { restaurantStore, useUserStore } from "../../../store/user_store";
import { postApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Loader2,
} from "lucide-react";

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
  const navigate = useNavigate();
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
        navigate("/dashboard/empl");
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
        navigate("/dashboard/empl");
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {itemMenuForUpdate ? "Update Employee" : "Add New Employee"}
              </h1>
              <p className="text-sm text-slate-400">
                {itemMenuForUpdate
                  ? "Modify employee details"
                  : "Add a new team member to your restaurant"}
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
          {/* Personal Information Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Personal Information</h2>
            </div>

            <div className="grid gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    placeholder="Enter employee's full name"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="employee@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <div className="absolute left-11 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                    +91
                  </div>
                  <input
                    {...register("contact_number", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit number",
                      },
                    })}
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-20 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                {errors.contact_number && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.contact_number.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Employment Details</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("role", {
                      required: "Role is required",
                    })}
                    type="text"
                    placeholder="e.g., Waiter, Chef, Manager"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                {errors.role && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Joining Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("joining_date", {
                      required: "Joining date is required",
                    })}
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                {errors.joining_date && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.joining_date.message}
                  </p>
                )}
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
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{itemMenuForUpdate ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <span>{itemMenuForUpdate ? "Update Employee" : "Add Employee"}</span>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Employees can access the system based on their assigned roles
        </p>
      </div>
    </div>
  );
}

export default CreateUpdateEmpl;
