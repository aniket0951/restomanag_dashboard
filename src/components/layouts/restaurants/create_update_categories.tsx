import { useForm } from "react-hook-form";
import { postApi } from "../../../utils/api";
import type { CreateCategoryRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalStorageKey } from "../../../utils/constants";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FolderOpen,
  Tag,
  FileText,
  Loader2,
} from "lucide-react";

type CategoryCreateForm = {
  name: string;
  description: string;
  restaurant_pid: string;
  pid: string;
};

function CreateUpdateCategories() {
  const navigate = useNavigate();
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

      if (res.status_code === 200) {
        toast.success(res.message);
        navigate("/dashboard/categories");
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log("Error creating");
    }
  };

  const onUpdate = async (data: CategoryCreateForm) => {
    try {
      const res = await postApi(EndPoint.UpdateCategory, data);
      if (res.status_code === 200) {
        toast.success(res.message);
        navigate("/dashboard/categories");
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {itemMenuForUpdate ? "Update Category" : "Create New Category"}
              </h1>
              <p className="text-sm text-slate-400">
                {itemMenuForUpdate
                  ? "Modify category details"
                  : "Add a new menu category to organize your items"}
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
          {/* Category Details Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Tag className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Category Details</h2>
            </div>

            <div className="grid gap-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("name", {
                      required: "Category name is required",
                    })}
                    type="text"
                    placeholder="e.g., Desserts, Pasta, Beverages"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Category Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={4}
                    placeholder="Describe what items this category contains..."
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 resize-none"
                  />
                </div>
                {errors.description && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.description.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  A brief description helps customers understand what to expect in this category
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
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{itemMenuForUpdate ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{itemMenuForUpdate ? "Update Category" : "Create Category"}</span>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Categories help organize your menu items for easier navigation
        </p>
      </div>
    </div>
  );
}

export default CreateUpdateCategories;
