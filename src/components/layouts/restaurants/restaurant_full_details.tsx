import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rounded_button } from "../../../utils/csstags";
import { getApi } from "../../../utils/api";
import type { GetRestaurantRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import Categories from "./categories";
import Menus from "./menus";
import Tables from "./tables";
import { Plus } from "lucide-react";
const owner_details_h3: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";

const parent_div: string =
  "bg-white/80 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 m-3 border border-slate-200/50 dark:border-slate-700/50";

const div_h2: string = "dark:text-white font-black";

function RestaurantFullDetails() {
  const { id } = useParams();
  const [restaurantDetails, setRestaurantDetails] =
    useState<GetRestaurantRes | null>(null);
  const calledRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      const res = await getApi<GetRestaurantRes>(EndPoint.GetRestaurant + id);
      setRestaurantDetails(res.data);
    } catch {
      console.log("Error");
    }
  };

  const addGeoLocation = (restaurantPID: string) => {
    navigate("/dashboard/restaurants/geolocation", {
      state: { restaurantPID: restaurantPID },
    });
  };

  return (
    <div className="">
      {/* Restaurant Details */}
      <div className={parent_div}>
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Restaurant Details
              </h3>
            </div>
            {/*<button
              className={`${rounded_button} cursor-pointer`}
              onClick={() => addGeoLocation(restaurantDetails?.pid || "")}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add GeoLocation</span>
            </button>*/}
          </div>
        </div>
        <div className="p-3.5">
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="p-1">
              <h2 className={div_h2}>Name</h2>
              <span className={owner_details_h3}>
                {restaurantDetails?.name ?? "NA"}
              </span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Address</h2>
              <span className={owner_details_h3}>
                {restaurantDetails
                  ? `${restaurantDetails.address_line1}, ${restaurantDetails.city}, ${restaurantDetails.state}`
                  : "NA"}
              </span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Cuisine</h2>
              <span className={owner_details_h3}>
                {restaurantDetails?.cuisine ?? "NA"}
              </span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Food Type</h2>
              <span className={owner_details_h3}>
                {restaurantDetails?.food_type ?? "NA"}
              </span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Contact No</h2>
              <span className={owner_details_h3}>
                {restaurantDetails?.contact_no ?? "NA"}
              </span>
            </div>
            <div className="p-1 flex justify-baseline">
              <div className="p-2">
                <h2 className={div_h2}>Open Time</h2>
                <span className={owner_details_h3}>
                  {restaurantDetails?.open_time ?? "NA"}
                </span>
              </div>

              <div className="p-2">
                <h2 className={div_h2}>Close Time</h2>
                <span className={owner_details_h3}>
                  {restaurantDetails?.close_time ?? "NA"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Categories */}
      <Categories restaurantID={id ?? null} />

      {/*Menus*/}
      <Menus restaurantID={id ?? null} />

      {/* Table */}
      <Tables restaurantID={id ?? null} />
    </div>
  );
}

export default RestaurantFullDetails;
