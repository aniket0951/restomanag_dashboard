import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { form_class } from "../../../utils/csstags";
import { LocalStorageKey } from "../../../utils/constants";
import { getApi, postApi } from "../../../utils/api";
import type { CreateRestaurantTableRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast/headless";
import { OrderTags, QueryParams } from "./queryparams";
import type { GetOrderFullDetailsRes } from "../../../types/orders";
import ShowOrderDetails from "./show_order_details";

type CreateRestaurantTableForm = {
  number: string;
  status: string;
  pid: string;
  restaurant_pid: string;
  capacity: number;
};

function DisplayAndUpdateOrder() {
  const navigate = useNavigate();
  const [orderFullDetails, setOrderFullDetails] =
    useState<GetOrderFullDetailsRes>();
  const { state } = useLocation();
  const orderPID = state?.orderPID;
  const tag = state?.tag as string | undefined;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRestaurantTableForm>({});

  useEffect(() => {
    if (tag === OrderTags.Display) {
      fetchOrderFullDetails(orderPID);
    }
  }, []);

  const fetchOrderFullDetails = async (orderPID: string) => {
    const res = await getApi<GetOrderFullDetailsRes>(
      EndPoint.GetOrdersFullDetails,
      {
        [QueryParams.OrderPID]: orderPID,
      },
    );

    if (res.status_code === 200 && res.data) {
      setOrderFullDetails(res.data);
    }
  };

  // useEffect(() => {
  //   if (stateCurrentTable != null && stateCurrentTable != undefined) {
  //     setValue("number", stateCurrentTable.number);
  //     setValue("status", stateCurrentTable.status);
  //     setValue("pid", stateCurrentTable.pid);
  //     setItemMenuForUpdate(true);
  //   }
  // }, [setItemMenuForUpdate, setValue, stateCurrentTable]);

  const onUpdate = async (data: CreateRestaurantTableForm) => {
    try {
      const restaurantPID = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      data.restaurant_pid = restaurantPID ?? "";

      const res = await postApi(EndPoint.UpdateRestaurantTable, data);

      if (res.status_code == 200) {
        toast.success(res.message);
        navigate("/dashboard/table");
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log();
    }
  };

  const onSubmit = async (data: CreateRestaurantTableForm) => {
    try {
      const restaurantPID = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );
      data.restaurant_pid = restaurantPID ?? "";
      console.log("Data : ", data);
      const res = await postApi<CreateRestaurantTableRes>(
        EndPoint.CreateRestaurantTable,
        data,
      );

      if (res.status_code == 200) {
        toast.success(res.message);
        navigate("/dashboard/table");
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log();
    }
  };

  return (
    <>
      {tag === OrderTags.Display && orderFullDetails ? (
        <ShowOrderDetails order={orderFullDetails} />
      ) : (
        <></>
      )}
    </>
  );
}

export default DisplayAndUpdateOrder;
