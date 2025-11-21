import { useForm } from "react-hook-form";
import { postApi } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import type { CreateOwnerAccountResponseData } from "../types/auth";
import { EndPoint } from "../utils/endpoints";

type SignupFormInputs = {
  name: string;
  email: string;
  contact_no: string;
  password: string;
};

function OwnerSignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      data.contact_no = "91" + data.contact_no;
      console.log("Request Data : ", data);
      const res = await postApi<CreateOwnerAccountResponseData>(
        EndPoint.CreateOwnerAccount,
        data,
      );

      if (res.status_code === 200) {
        console.log("API Response success");
      }

      navigate("/");
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
          Sign Up
        </h2>

        {/* Name */}
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Name
          </label>
          <input
            {...register("name", {
              required: "Name is required",
            })}
            type="text"
            className="block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white
              outline-1 outline-white/10 placeholder:text-gray-400
              focus:outline-2 focus:outline-slate-200/50 sm:text-sm"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

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

        {/* Contact Field */}
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Contact No
          </label>
          <input
            {...register("contact_no", {
              required: "Contact no is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message:
                  "Invalid contact number. Must be 10 digits starting with 6-9",
              },
            })}
            type="number"
            className="block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white
              outline-1 outline-white/10 placeholder:text-gray-400
              focus:outline-2 focus:outline-slate-200/50 sm:text-sm"
            placeholder="8261861123"
          />
          {errors.contact_no && (
            <p className="text-red-400 text-xs mt-1">
              {errors.contact_no.message}
            </p>
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
            {isSubmitting ? "Creating ..." : "Sign Up"}
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

export default OwnerSignUp;
