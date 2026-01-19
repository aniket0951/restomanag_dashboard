import type { GetOrderFullDetailsRes } from "../../../types/orders";
import { form_class } from "../../../utils/csstags";
import { formatOrderId, unixToString } from "../../../utils/utils";

export const customer_info_class: string =
  "w-full border border-white/10 rounded-xl p-3 shadow-md bg-white/10 backdrop-blur-md dark:bg-slate-800/50";

function ShowOrderDetails({ order }: { order: GetOrderFullDetailsRes }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className={`${form_class} max-w-4xl mx-auto`}>
      <div className="flex justify-between">
        <span className="text-slate-300 dark:text-slate-200">
          # {formatOrderId(order.order_obj.pid)}
        </span>
        <div className="flex items-center gap-4 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-lx font-semibold ${getStatusColor(order.order_obj.status)} capitalize`}
          >
            {order.order_obj.status}
          </span>
        </div>
      </div>
      <div>
        <span className="text-slate-300 dark:text-slate-400">
          Placed On {unixToString(order.order_obj.created_at)}
        </span>
      </div>
      <hr className="border-gray-300 mt-2" />
      {/* CustomerInfo */}
      <div className={`${customer_info_class} mt-3`}>
        <span className="ext-sm font-semibold text-slate-500 dark:text-slate-500 mb-3">
          Customer Information
        </span>
        <div className="mt-3 p-1">
          <p className="text-xs text-slate-500 dark:text-slate-500">Name</p>
          <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
            {order.customer_details.name}
          </p>
        </div>
        <div className="mt-3 p-1">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Contact No
          </p>
          <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
            {order.customer_details.contact_no}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShowOrderDetails;
