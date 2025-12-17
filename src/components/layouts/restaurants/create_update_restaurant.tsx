import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { postApi } from "../../../utils/api";
import type { CreateRestaurantRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { form_class } from "../../../utils/csstags";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { stateCityMap } from "../../../utils/state";

const form_label: string =
  "block mb-2.5 text-sm font-medium text-heading dark:text-white";

const form_grid_div: string = "grid md:grid-cols-2 md:gap-6 mt-5";
const form_input: string =
  "block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm";

const form_dropdown: string =
  "block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 outline-white/10 focus:outline-2 focus:outline-slate-200/50 sm:text-sm dark:bg-slate-800/50";

const submit_btn: string =
  "flex justify-center items-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-500 hover:shadow-lg active:scale-95 transition-all duration-300 mt-4 cursor-pointer w-sm text-center disabled:opacity-50";

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
  {
    id: 1,
    name: "Veg",
    value: "veg",
  },
  {
    id: 2,
    name: "Non Veg",
    value: "non_veg",
  },
  {
    id: 3,
    name: "Both",
    value: "both",
  },
];

// Add this interface near your other types
interface TagsInputProps {
  label: string;
  name: keyof RestaurantCreateForm;
  setValue: UseFormSetValue<RestaurantCreateForm>;
  watch: UseFormWatch<RestaurantCreateForm>;
}

function TagsInput({ label, name, setValue, watch }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const tags = (watch(name) as string[]) || [];

  // Add tag on space or enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && inputValue.trim() !== "") {
      e.preventDefault();

      const newTag = inputValue.trim();

      if (!tags.includes(newTag)) {
        setValue(name, [...tags, newTag]); // update RHF form
      }

      setInputValue(""); // clear input
    }
  };

  const removeTag = (tag: string) => {
    setValue(
      name,
      tags.filter((t: string) => t !== tag),
    );
  };

  return (
    <div className="relative z-10">
      <label className="block  text-sm font-medium text-heading dark:text-white">
        {label}
      </label>

      {/* Tags container */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag: string, index: number) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-white hover:text-red-300"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Input box */}
      <input
        type="text"
        value={inputValue}
        placeholder="Type & press space…"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white
        outline outline-1 outline-white/10 placeholder:text-gray-400
        focus:outline-2 focus:outline-slate-200/50 sm:text-sm"
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

  // Watch the state field and update selectedState accordingly
  const watchedState = watch("state");
  useEffect(() => {
    if (watchedState) {
      setSelectedState(watchedState);
    }
  }, [watchedState]);

  useEffect(() => {
    if (stateRestaurant != null && stateRestaurant != undefined) {
      console.log("stateRestaurant : ", stateRestaurant);
      setValue("name", stateRestaurant.name);
      setValue("pid", stateRestaurant.pid);
      setValue("address", stateRestaurant.address_line1);

      // Remove "91" prefix if present
      const contactNo = stateRestaurant.contact_no.startsWith("91")
        ? stateRestaurant.contact_no.substring(2)
        : stateRestaurant.contact_no;
      setValue("contact_no", contactNo);

      // Capitalize first character of state
      const formattedState =
        stateRestaurant.state.charAt(0).toUpperCase() +
        stateRestaurant.state.slice(1);
      setValue("state", formattedState); // This will trigger watchedState update
      setValue("pincode", stateRestaurant.pincode);

      // Parse cuisine string to array
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

  // Set city after selectedState is updated (for edit mode)
  useEffect(() => {
    if (
      stateRestaurant &&
      selectedState &&
      selectedState === stateRestaurant.state
    ) {
      // Capitalize first character of city
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
      // setError("email", { message: "Login failed, please try again" });
      // toast.error("Login failed, please try again");
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
      console.log();
    }
  };

  return (
    <form
      onSubmit={
        isItemForUpdate ? handleSubmit(onUpdate) : handleSubmit(onSubmit)
      }
      className={`${form_class} max-w-3xl mx-auto`}
    >
      <h1 className="text-slate-500 dark:text-slate-500 m-3">
        {isItemForUpdate ? "Update Restaurant" : "Create New Restaurant"}
      </h1>
      <div className={form_grid_div}>
        <div className="relative z-0">
          <label className={form_label}>Restaurant Name</label>
          <input
            {...register("name", {
              required: "Name is required",
            })}
            type="text"
            className={form_input}
            placeholder="mdocs"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="relative z-0">
          <label className={form_label}>Food Type</label>

          <select
            {...register("food_type", {
              required: "Food type is required",
            })}
            className={form_dropdown}
          >
            <option value="" className="text-black">
              -- Choose Food Type --
            </option>
            {FoodType.map((foodType) => (
              <option
                value={foodType.value}
                className="text-black"
                key={foodType.id}
              >
                {foodType.name}
              </option>
            ))}
          </select>
          {errors.food_type && (
            <p className="text-red-400 text-xs mt-1">
              {errors.food_type.message}
            </p>
          )}
        </div>
      </div>

      {/* Cuisine */}
      <div className={`${form_grid_div} mt-3`}>
        <div className="relative z-0 w-[500px]">
          <TagsInput
            label="Cuisine (multiple)"
            name="cuisine"
            setValue={setValue}
            watch={watch}
          />
        </div>
      </div>

      {/* Open/Close Times */}
      {/*<div className={`${form_grid_div} mt-3`}>
        <div className="relative z-0">
          <label className={form_label}>Open Time</label>

          <select
            {...register("open_time", { required: true })}
            className={form_input}
          >
            <option value="">Select a time</option>

            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time} className="text-black">
                {time}
              </option>
            ))}
          </select>
          {errors.open_time && (
            <p className="text-red-400 text-xs mt-1">
              {errors.open_time.message}
            </p>
          )}
        </div>
        <div className="relative z-0">
          <label className={form_label}>Close Time</label>

          <select
            {...register("close_time", { required: true })}
            className={form_input}
          >
            <option value="">Select a time</option>

            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time} className="text-black">
                {time}
              </option>
            ))}
          </select>
          {errors.close_time && (
            <p className="text-red-400 text-xs mt-1">
              {errors.close_time.message}
            </p>
          )}
        </div>
      </div>*/}

      {/* Address */}
      <div className={`${form_grid_div} mt-3`}>
        <div className="relative z-0 w-[500px]">
          <label className={form_label}>Address</label>
          <input
            {...register("address", {
              required: "Address is required",
            })}
            type="text"
            className={form_input}
            placeholder="viman nagar, pune"
          />
          {errors.address && (
            <p className="text-red-400 text-xs mt-1">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <div className={`${form_grid_div} mt-3`}>
        <div className="relative z-0">
          <label className={form_label}>State</label>

          <select
            {...register("state", {
              required: "State is required",
              onChange: (e) => {
                const val = e.target.value;
                setSelectedState(val);
                setValue("city", ""); // Reset city when state changes
              },
            })}
            className={form_dropdown}
          >
            <option value="">Select State</option>
            {Object.keys(stateCityMap).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>
        <div className="relative z-0">
          <label className={form_label}>City</label>

          <select
            {...register("city", {
              required: "City is required",
            })}
            className={form_dropdown}
            disabled={!selectedState} // disable until user selects state
          >
            <option value="">Select City</option>

            {selectedState &&
              stateCityMap[selectedState]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
          {errors.city && (
            <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* pincode && contact No */}

      <div className={`${form_grid_div} mt-3`}>
        <div className="relative z-0">
          <label className={form_label}>Pincode</label>
          <input
            {...register("pincode", {
              required: "Pincode is required",
              pattern: {
                value: /^[0-9]{6}$/, // exactly 10 digits
                message: "Picode must be 6 digits",
              },
            })}
            type="number"
            className={form_input}
            placeholder="414123"
            maxLength={6}
          />
          {errors.pincode && (
            <p className="text-red-400 text-xs mt-1">
              {errors.pincode.message}
            </p>
          )}
        </div>
        <div className="relative z-0">
          <label className={form_label}>Contact No</label>
          <input
            {...register("contact_no", {
              required: "Contact No is required",
              pattern: {
                value: /^[0-9]{10}$/, // exactly 10 digits
                message: "Contact number must be 10 digits",
              },
            })}
            type="number"
            className={form_input}
            placeholder="8267116611"
            maxLength={10}
          />
          {errors.contact_no && (
            <p className="text-red-400 text-xs mt-1">
              {errors.contact_no.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        {isItemForUpdate ? (
          <button type="submit" disabled={isSubmitting} className={submit_btn}>
            {isSubmitting ? "Update Restaurant..." : "Update"}
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className={submit_btn}>
            {isSubmitting ? "Registering Restaurant..." : "Register"}
          </button>
        )}
      </div>
    </form>
  );
}

export default CreateUpdareRestaurant;

function generateTimes() {
  const list = [];
  for (let h = 0; h < 24; h++) {
    for (const m of ["00", "30"]) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      list.push(`${hour}:${m} ${ampm}`);
    }
  }
  return list;
}

// const TIME_OPTIONS = generateTimes();
