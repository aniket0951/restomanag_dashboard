import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getApi } from "../../../utils/api";
import type { GetRestaurantRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import Categories from "./categories";
import Menus from "./menus";
import Tables from "./tables";
import {
  Store,
  MapPin,
  UtensilsCrossed,
  Leaf,
  Phone,
  Clock,
} from "lucide-react";

function RestaurantFullDetails() {
  const { id } = useParams();
  const [restaurantDetails, setRestaurantDetails] =
    useState<GetRestaurantRes | null>(null);
  const calledRef = useRef(false);

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

  return (
    <div className="">
      {/* Restaurant Details */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl backdrop-blur-xl overflow-hidden border border-white/10 shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Restaurant Details
              </h3>
              <p className="text-sm text-slate-400">Overview and information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Store className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Name
                </span>
              </div>
              <p className="text-lg font-semibold text-white pl-11">
                {restaurantDetails?.name ?? "NA"}
              </p>
            </div>

            {/* Address */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Address
                </span>
              </div>
              <p className="text-lg font-semibold text-white pl-11">
                {restaurantDetails
                  ? `${restaurantDetails.address_line1}, ${restaurantDetails.city}, ${restaurantDetails.state}`
                  : "NA"}
              </p>
            </div>

            {/* Cuisine */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Cuisine
                </span>
              </div>
              <p className="text-lg font-semibold text-white pl-11">
                {restaurantDetails?.cuisine ?? "NA"}
              </p>
            </div>

            {/* Food Type */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Food Type
                </span>
              </div>
              <p className="text-lg font-semibold text-white pl-11">
                {restaurantDetails?.food_type ?? "NA"}
              </p>
            </div>

            {/* Contact No */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Contact No
                </span>
              </div>
              <p className="text-lg font-semibold text-white pl-11">
                {restaurantDetails?.contact_no ?? "NA"}
              </p>
            </div>

            {/* Timings */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Operating Hours
                </span>
              </div>
              <div className="flex items-center gap-6 pl-11">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Opens at</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-semibold">
                    {restaurantDetails?.open_time ?? "NA"}
                  </span>
                </div>
                <div className="w-8 h-px bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Closes at</span>
                  <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 font-semibold">
                    {restaurantDetails?.close_time ?? "NA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="mt-5">
        <Categories restaurantID={id ?? null} />
      </div>

      {/*Menus*/}
      <div className="mt-5">
        <Menus restaurantID={id ?? null} />
      </div>

      {/* Table */}
      <div className="mt-5">
        <Tables restaurantID={id ?? null} />
      </div>
    </div>
  );
}

export default RestaurantFullDetails;
