import StatusGrid, {
  CompletedOrders,
  CurrentDayRevenue,
  OrderInit,
  PendingOrders,
} from "../../../dashboard/stats";

function Orders() {
  return (
    <div>
      <span>Order</span>
      <StatusGrid>
        <OrderInit />
        <PendingOrders />
        <CompletedOrders />
        <CurrentDayRevenue />
      </StatusGrid>
    </div>
  );
}

export default Orders;
