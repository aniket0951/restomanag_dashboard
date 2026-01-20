import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { postApi } from "../../../utils/api";
import type { CreateRestaurantRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { stateCityMap } from "../../../utils/state";
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Utensils,
  Building2,
  Hash,
  ChevronDown,
  Leaf,
  Drumstick,
  X,
} from "lucide-react";

type RestaurantCreateForm = {
  name: string;
  address: string;
  contact_no: string;
  city: string;
  state: string;
  pincode: string;
  food_type: string;
  cuisine: Array<string>;
  open_time: string;
  close_time: string;
  pid: string;
};

const FoodType = [
  { id: 1, name: "Veg", value: "veg", icon: Leaf, color: "text-emerald-400" },
  { id: 2, name: "Non Veg", value: "non_veg", icon: Drumstick, color: "text-red-400" },
  { id: 3, name: "Both", value: "both", icon: Utensils, color: "text-purple-400" },
];

interface TagsInputProps {
  label: string;
  name: keyof RestaurantCreateForm;
  setValue: UseFormSetValue<RestaurantCreateForm>;
  watch: UseFormWatch<RestaurantCreateForm>;
}

function TagsInput({ label, name, setValue, watch }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const tags = (watch(name) as string[]) || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setValue(name, [...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    setValue(
      name,
      tags.filter((t: string) => t !== tag),
    );
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              className="hover:text-red-400 transition-colors"
              onClick={() => removeTag(tag)}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={inputValue}
        placeholder="Type cuisine & press space..."
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
      />
    </div>
  );
}

function CreateUpdareRestaurant() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [isItemForUpdate, setIsItemForUpdate] = useState(false);
  const { state } = useLocation();
  const navigateToDashBoard: string = "/dashboard/restaurants";
  const stateRestaurant = state?.restaurant;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantCreateForm>({
    defaultValues: {
      cuisine: [],
    },
  });

  const watchedState = watch("state");
  useEffect(() => {
    if (watchedState) {
      setSelectedState(watchedState);
    }
  }, [watchedState]);

  useEffect(() => {
    if (stateRestaurant != null && stateRestaurant != undefined) {
      setValue("name", stateRestaurant.name);
      setValue("pid", stateRestaurant.pid);
      setValue("address", stateRestaurant.address_line1);

      const contactNo = stateRestaurant.contact_no.startsWith("91")
        ? stateRestaurant.contact_no.substring(2)
        : stateRestaurant.contact_no;
      setValue("contact_no", contactNo);

      const formattedState =
        stateRestaurant.state.charAt(0).toUpperCase() +
        stateRestaurant.state.slice(1);
      setValue("state", formattedState);
      setValue("pincode", stateRestaurant.pincode);

      if (stateRestaurant.cuisine) {
        const cuisineArray = stateRestaurant.cuisine
          .split(",")
          .map((c: string) => c.trim());
        setValue("cuisine", cuisineArray);
      }

      setValue("food_type", stateRestaurant.food_type);
      setValue("open_time", stateRestaurant.open_time);
      setValue("close_time", stateRestaurant.close_time);
      setIsItemForUpdate(true);
    }
  }, [stateRestaurant, setValue]);

  useEffect(() => {
    if (
      stateRestaurant &&
      selectedState &&
      selectedState === stateRestaurant.state
    ) {
      const formattedCity =
        stateRestaurant.city.charAt(0).toUpperCase() +
        stateRestaurant.city.slice(1);
      setValue("city", formattedCity);
    }
  }, [selectedState, stateRestaurant, setValue]);

  const onSubmit = async (data: RestaurantCreateForm) => {
    try {
      data.contact_no = "91" + data.contact_no;
      const res = await postApi<CreateRestaurantRes>(
        EndPoint.CreateRestaurant,
        data,
      );

      if (res.status_code === 200) {
        toast.success(res.message);
        navigate(navigateToDashBoard);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onUpdate = async (data: RestaurantCreateForm) => {
    try {
      data.contact_no = "91" + data.contact_no;
      const res = await postApi<CreateRestaurantRes>(
        EndPoint.UpdateRestaurant,
        data,
      );
      if (res.status_code == 200) {
        toast.success(res.message);
        navigate(navigateToDashBoard);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {isItemForUpdate ? "Update Restaurant" : "Create New Restaurant"}
                </h1>
                <p className="text-sm text-slate-400">
                  {isItemForUpdate
                    ? "Update your restaurant details"
                    : "Fill in the details to register your restaurant"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={
            isItemForUpdate ? handleSubmit(onUpdate) : handleSubmit(onSubmit)
          }
          className="p-6 space-y-6"
        >
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Restaurant Name
                </label>
                <div className="relative">
                  <Store className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="Enter restaurant name"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Food Type
                </label>
                <div className="relative">
                  <Utensils className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <select
                    {...register("food_type", { required: "Food type is required" })}
                    className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">
                      Choose Food Type
                    </option>
                    {FoodType.map((foodType) => (
                      <option
                        value={foodType.value}
                        className="bg-slate-800"
                        key={foodType.id}
                      >
                        {foodType.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.food_type && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.food_type.message}</p>
                )}
              </div>
            </div>

            {/* Cuisine */}
            <TagsInput
              label="Cuisine (type and press space to add)"
              name="cuisine"
              setValue={setValue}
              watch={watch}
            />
          </div>

          {/* Location Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                <input
                  {...register("address", { required: "Address is required" })}
                  type="text"
                  placeholder="Enter full address"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                />
              </div>
              {errors.address && (
                <p className="text-red-400 text-xs mt-1.5">{errors.address.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State
                </label>
                <div className="relative">
                  <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <select
                    {...register("state", {
                      required: "State is required",
                      onChange: (e) => {
                        const val = e.target.value;
                        setSelectedState(val);
                        setValue("city", "");
                      },
                    })}
                    className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">
                      Select State
                    </option>
                    {Object.keys(stateCityMap).map((state) => (
                      <option key={state} value={state} className="bg-slate-800">
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.state && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  City
                </label>
                <div className="relative">
                  <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <select
                    {...register("city", { required: "City is required" })}
                    disabled={!selectedState}
                    className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-slate-800">
                      Select City
                    </option>
                    {selectedState &&
                      stateCityMap[selectedState]?.map((city) => (
                        <option key={city} value={city} className="bg-slate-800">
                          {city}
                        </option>
                      ))}
                  </select>
                </div>
                {errors.city && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pincode
                </label>
                <div className="relative">
                  <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register("pincode", {
                      required: "Pincode is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Pincode must be 6 digits",
                      },
                    })}
                    type="text"
                    placeholder="Enter pincode"
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>
                {errors.pincode && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.pincode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <span className="absolute left-11 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    +91
                  </span>
                  <input
                    {...register("contact_no", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Contact number must be 10 digits",
                      },
                    })}
                    type="text"
                    placeholder="Enter contact number"
                    maxLength={10}
                    className="w-full pl-20 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>
                {errors.contact_no && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.contact_no.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
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
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isItemForUpdate ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isItemForUpdate ? "Update Restaurant" : "Create Restaurant"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUpdareRestaurant;
