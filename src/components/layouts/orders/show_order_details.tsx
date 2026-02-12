import { useNavigate } from "react-router-dom";
import type { GetOrderFullDetailsRes } from "../../../types/orders";
import { form_class } from "../../../utils/csstags";
import { formatOrderId, unixToString } from "../../../utils/utils";

export const card_class: string =
  "w-full border border-white/10 rounded-xl p-4 shadow-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md dark:from-slate-800/60 dark:to-slate-800/40 hover:shadow-xl hover:border-white/20 transition-all duration-300";

function ShowOrderDetails({ order }: { order: GetOrderFullDetailsRes }) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 shadow-green-200/50 shadow-sm";
      case "Shipped":
        return "bg-blue-100 text-blue-800 shadow-blue-200/50 shadow-sm";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 shadow-yellow-200/50 shadow-sm";
      case "preparing":
        return "bg-orange-100 text-orange-800 shadow-orange-200/50 shadow-sm";
      case "pending":
        return "bg-purple-100 text-purple-800 shadow-purple-200/50 shadow-sm";
      default:
        return "bg-gray-100 text-gray-800 shadow-sm";
    }
  };
  return (
    <div className={`${form_class} max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200"
            title="Go back"
          >
            <svg
              className="w-5 h-5 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">#</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              {formatOrderId(order.order_obj.pid)}
            </h2>
            <p className="text-xs text-slate-400">
              {unixToString(order.order_obj.created_at)}
            </p>
          </div>
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(order.order_obj.status)} capitalize`}
        >
          {order.order_obj.status}
        </span>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4" />
      {/* Customer & Waiter Info */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* CustomerInfo */}
        <div className={`${card_class} flex-1`}>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-300">Customer</span>
          </div>
          <div className="space-y-3">
            <div className="group">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Name</p>
              <p className="text-sm font-medium text-slate-100 mt-0.5">
                {order.customer_details.name}
              </p>
            </div>
            <div className="group">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Contact</p>
              <p className="text-sm font-medium text-slate-100 mt-0.5">
                {order.customer_details.contact_no}
              </p>
            </div>
          </div>
        </div>
        {/* Waiter Info */}
        <div className={`${card_class} flex-1`}>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-300">Waiter</span>
          </div>
          <div className="space-y-3">
            <div className="group">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Name</p>
              <p className="text-sm font-medium text-slate-100 mt-0.5">
                {order.waiter_details.waiter_name}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Order Details */}
      <div className={`${card_class} mt-4`}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-300">Order Details</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="group">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Restaurant</p>
            <p className="text-sm font-medium text-slate-100 mt-0.5">
              {order.order_obj.restaurant_name}
            </p>
          </div>
          <div className="group">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Table No</p>
            <p className="text-sm font-medium text-slate-100 mt-0.5">
              {order.order_obj.table_no}
            </p>
          </div>
          <div className="group col-span-2 md:col-span-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Amount</p>
            <p className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-0.5">
              ₹{order.order_obj.total_amount}
            </p>
          </div>
        </div>
      </div>
      {/* Menu Items */}
      <div className={`${card_class} mt-4`}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-300">Menu Items</span>
          <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">
            {order.order_obj.menu_items.length} items
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Item
                </th>
                <th className="text-center py-3 px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Qty
                </th>
                <th className="text-right py-3 px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Price
                </th>
                <th className="text-right py-3 px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Subtotal
                </th>
                <th className="text-center py-3 px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {order.order_obj.menu_items.map((item, index) => (
                <tr
                  key={item.pid}
                  className={`border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ring-2 ${item.is_veg ? "bg-green-500 ring-green-500/30" : "bg-red-500 ring-red-500/30"}`}
                      />
                      <span className="text-slate-100 font-medium">
                        {item.menu_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-slate-100 bg-white/10 px-2 py-0.5 rounded">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    ₹{item.price}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-100 font-medium">
                    ₹{item.quantity * item.price}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(item.status)} capitalize`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShowOrderDetails;
