import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getApi, postApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { OrderTags, QueryParams } from "./queryparams";
import { EmplRoles } from "../../../utils/constants";
import { restaurantStore } from "../../../store/user_store";
import type { GetOrderFullDetailsRes, MenuItems, AssignWaiterToOrderReq } from "../../../types/orders";
import type { ListEmplsByRoleAndRestoRes } from "../../../types/empls";
import ShowOrderDetails from "./show_order_details";
import EditOrderDetails from "./edit_order_details";
import WaiterSelectionModal from "./waiter_selection_modal";
import ConfirmModal from "./confirm_modal";

function DisplayAndUpdateOrder() {
  const [orderFullDetails, setOrderFullDetails] =
    useState<GetOrderFullDetailsRes>();
  const [waiters, setWaiters] = useState<ListEmplsByRoleAndRestoRes[]>([]);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isLoadingWaiters, setIsLoadingWaiters] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<MenuItems | null>(null);
  const { state } = useLocation();
  const orderPID = state?.orderPID;
  const tag = state?.tag as string | undefined;
  const restaurantstore = restaurantStore((state) => state.restaurant);

  useEffect(() => {
    if (tag === OrderTags.Display || tag === OrderTags.Edit) {
      fetchOrderFullDetails(orderPID);
    }
  }, [orderPID, tag]);

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

  const fetchWaiters = async () => {
    setIsLoadingWaiters(true);
    const res = await getApi<ListEmplsByRoleAndRestoRes[]>(
      EndPoint.ListEmplByRoleAndResto,
      {
        [QueryParams.Role]: EmplRoles.Waiter,
        [QueryParams.RestaurantPID]: restaurantstore?.id,
      },
    );

    if (res.status_code === 200 && res.data) {
      setWaiters(res.data);
    }
    setIsLoadingWaiters(false);
  };

  const handleAssignWaiter = async () => {
    await fetchWaiters();
    setIsWaiterModalOpen(true);
  };

  const handleWaiterSelect = async (waiter: ListEmplsByRoleAndRestoRes) => {
    if (!orderFullDetails || !restaurantstore?.id) return;

    const req: AssignWaiterToOrderReq = {
      order_pid: orderFullDetails.order_obj.pid,
      waiter_pid: waiter.pid,
      restaurant_pid: restaurantstore.id,
    };

    const res = await postApi(EndPoint.AssignOrderToWaiter, req);

    if (res.status_code === 200) {
      setOrderFullDetails({
        ...orderFullDetails,
        waiter_details: {
          waiter_pid: waiter.pid,
          waiter_name: waiter.name,
        },
      });
      toast.success(`Waiter changed to ${waiter.name}`);
    }

    setIsWaiterModalOpen(false);
  };

  const handleRemoveItem = (itemPid: string) => {
    if (!orderFullDetails) return;

    // Find the item to remove for confirmation message
    const item = orderFullDetails.order_obj.menu_items.find(
      (item) => item.pid === itemPid
    );

    if (item) {
      setItemToRemove(item);
      setIsConfirmModalOpen(true);
    }
  };

  const confirmRemoveItem = () => {
    if (!orderFullDetails || !itemToRemove) return;

    // Filter out the removed item
    const updatedMenuItems = orderFullDetails.order_obj.menu_items.filter(
      (item) => item.pid !== itemToRemove.pid
    );

    // Recalculate total amount
    const newTotalAmount = updatedMenuItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Update state
    setOrderFullDetails({
      ...orderFullDetails,
      order_obj: {
        ...orderFullDetails.order_obj,
        menu_items: updatedMenuItems,
        total_amount: newTotalAmount,
      },
    });

    // TODO: Call API to remove item from order
    console.log("Removed item:", itemToRemove.pid);

    // Close modal and reset
    setIsConfirmModalOpen(false);
    setItemToRemove(null);
  };

  const cancelRemoveItem = () => {
    setIsConfirmModalOpen(false);
    setItemToRemove(null);
  };

  return (
    <>
      {tag === OrderTags.Display && orderFullDetails ? (
        <ShowOrderDetails order={orderFullDetails} />
      ) : tag === OrderTags.Edit && orderFullDetails ? (
        <>
          <EditOrderDetails
            order={orderFullDetails}
            onAssignWaiter={handleAssignWaiter}
            onRemoveItem={handleRemoveItem}
            isLoadingWaiters={isLoadingWaiters}
          />
          <WaiterSelectionModal
            isOpen={isWaiterModalOpen}
            waiters={waiters}
            onClose={() => setIsWaiterModalOpen(false)}
            onSelect={handleWaiterSelect}
          />
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            title="Remove Item"
            message={`Are you sure you want to remove "${itemToRemove?.menu_name}" from this order?`}
            confirmText="Remove"
            cancelText="Cancel"
            onConfirm={confirmRemoveItem}
            onCancel={cancelRemoveItem}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default DisplayAndUpdateOrder;
