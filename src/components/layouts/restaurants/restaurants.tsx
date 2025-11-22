import { useEffect } from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import { form_class, rounded_button } from "../../../utils/csstags";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { stateCityMap } from "../../../utils/state";
import { getApi, postApi } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

import type {
  CreateRestaurantRes,
  ListRestaurantsRes,
} from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-slate-600 border-r border-slate-200 dark:border-slate-700";
const td: string = "p-4 border-r border-slate-200 dark:border-slate-700";
const td_span: string = "text-sm font-medium text-blue dark:text-white";
const form_label: string =
  "block mb-2.5 text-sm font-medium text-heading dark:text-white";

const form_grid_div: string = "grid md:grid-cols-2 md:gap-6";
const form_input: string =
  "block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-slate-200/50 sm:text-sm";

const form_dropdown: string =
  "block w-full mt-2 rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 outline-white/10 focus:outline-2 focus:outline-slate-200/50 sm:text-sm dark:bg-slate-800/50";

const action_button: string =
  "relative w-full p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

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

function TagsInput({ label, name, register, setValue, watch }) {
  const [inputValue, setInputValue] = useState("");
  const tags = watch(name) || [];

  // Add tag on space or enter
  const handleKeyDown = (e) => {
    if ((e.key === " " || e.key === "Enter") && inputValue.trim() !== "") {
      e.preventDefault();

      const newTag = inputValue.trim();

      if (!tags.includes(newTag)) {
        setValue(name, [...tags, newTag]); // update RHF form
      }

      setInputValue(""); // clear input
    }
  };

  const removeTag = (tag) => {
    setValue(
      name,
      tags.filter((t) => t !== tag),
    );
  };

  return (
    <div className="relative z-10">
      <label className="block  text-sm font-medium text-heading dark:text-white">
        {label}
      </label>

      {/* Tags container */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
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

function Restaurants() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [restaurants, setRestaurants] = useState<ListRestaurantsRes[]>([]);

  useEffect(() => {
    console.log("fetching list of restaurantss...");
    fetchRestaurants();
  }, []);

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

  const onSubmit = async (data: RestaurantCreateForm) => {
    try {
      data.contact_no = "91" + data.contact_no;
      const res = await postApi<CreateRestaurantRes>(
        EndPoint.CreateRestaurant,
        data,
      );

      toast.success(res.message);
      setIsFormOpen(false);
      fetchRestaurants();
    } catch {
      // setError("email", { message: "Login failed, please try again" });
      // toast.error("Login failed, please try again");
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await getApi<ListRestaurantsRes[]>(EndPoint.ListRestaurant);
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {isFormOpen ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${form_class} max-w-3xl mx-auto`}
        >
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
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
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
                register={register}
                setValue={setValue}
                watch={watch}
              />
            </div>
          </div>

          {/* Open/Close Times */}
          <div className={`${form_grid_div} mt-3`}>
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
          </div>

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
                })}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedState(val);
                }}
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
                <p className="text-red-400 text-xs mt-1">
                  {errors.state.message}
                </p>
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
                <p className="text-red-400 text-xs mt-1">
                  {errors.city.message}
                </p>
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center py-2 px-4
                bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl
                hover:from-purple-600 hover:to-blue-500 hover:shadow-lg
                active:scale-95 transition-all duration-300 mt-4 cursor-pointer
               w-sm text-center disabled:opacity-50"
            >
              {isSubmitting ? "Registering Restaurant..." : "Register"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-b-2xl
      border border-slate-200/50 dark:border-slate-700/50 overflow-hidden h-[600px]"
          >
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Restaurants
                  </h3>
                </div>
                <button
                  className={`${rounded_button} cursor-pointer`}
                  onClick={() => setIsFormOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add New</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className={th_class}> Restaurant Name </th>
                    <th className={th_class}> State </th>
                    <th className={th_class}> City </th>
                    <th className={th_class}> Cuisine </th>
                    <th className={th_class}> Food Type </th>
                    <th className={th_class}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((restaurant) => (
                    <tr
                      onClick={() =>
                        navigate("/dashboard/restaurants/" + restaurant.pid)
                      }
                      className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
                hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td key={restaurant.pid} className={td}>
                        <span className={td_span}>{restaurant.name}</span>
                      </td>

                      <td key={restaurant.pid} className={td}>
                        <span className={td_span}>{restaurant.state}</span>
                      </td>
                      <td key={restaurant.pid} className={td}>
                        <span className={td_span}>{restaurant.city}</span>
                      </td>

                      <td key={restaurant.pid} className={td}>
                        <span className={td_span}>{restaurant.cuisine}</span>
                      </td>
                      <td key={restaurant.pid} className={td}>
                        <span className={td_span}>{restaurant.food_type}</span>
                      </td>
                      <td key={restaurant.pid} className={td}>
                        <div className="flex gap-2 items-center">
                          <button className={action_button}>
                            <Pencil className="w-full h-4.5" />
                          </button>

                          <button className={action_button}>
                            <Trash className="w-full h-4.5 " />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Restaurants;

function generateTimes() {
  const list = [];
  for (let h = 0; h < 24; h++) {
    for (let m of ["00", "30"]) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      list.push(`${hour}:${m} ${ampm}`);
    }
  }
  return list;
}

const TIME_OPTIONS = generateTimes();
