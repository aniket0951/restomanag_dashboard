import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { postApi } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import type { LoginResponseData } from "../types/auth";
import { EndPoint } from "../utils/endpoints";
import { useUserStore } from "../store/user_store";
import type { User as userInterface } from "../store/user_store";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const ownerDashBord = "/dashboard";
  const setUserStore = useUserStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate(ownerDashBord);
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await postApi<LoginResponseData>(
        EndPoint.OwnerAccountLogin,
        data,
      );
      const user: userInterface = {
        id: res.data.user_id,
        name: res.data.name,
        email: res.data.email,
      };

      setUserStore(user);

      localStorage.setItem("authToken", res.data.access_token);
      navigate(ownerDashBord);
    } catch {
      // setError("email", { message: "Login failed, please try again" });
      // toast.error("Login failed, please try again");
    }
  };

  return (
    <div
      className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500
      items-center justify-center"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm border border-white/10 rounded-xl p-6 shadow-md
          bg-white/10 backdrop-blur-md dark:bg-slate-800/50"
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-6">
          Login
        </h2>

        {/* Email Field */}
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Email
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            type="email"
            className="block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white
              outline-1 outline-white/10 placeholder:text-gray-400
              focus:outline-2 focus:outline-slate-200/50 sm:text-sm"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Password
          </label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
            type="password"
            className="block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white
              outline-1 outline-white/10 placeholder:text-gray-400
              focus:outline-2 focus:outline-slate-200/50 sm:text-sm"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-2">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex justify-center items-center py-2 px-4
              bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl
              hover:from-purple-600 hover:to-blue-500 hover:shadow-lg
              active:scale-95 transition-all duration-300 mt-4 cursor-pointer
              w-full text-center disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
        {/* Signup Option */}
        <div className="text-center mt-5">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
