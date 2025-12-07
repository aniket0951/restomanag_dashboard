import StatusGrid, {
  CompletedOrders,
  CurrentDayRevenue,
  OrderInit,
  PendingOrders,
} from "../../../dashboard/stats";

function Orders() {
  return (
    <div>
      <StatusGrid>
        <OrderInit />
        <PendingOrders />
        <CompletedOrders />
        <CurrentDayRevenue />
      </StatusGrid>
      <span className="text-slate-400 dark:text-slate-300 mt-5">
        Current Orders
      </span>
    </div>
  );
}

export default Orders;
