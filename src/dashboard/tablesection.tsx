import { TrendingUp, ShoppingBag, Clock, CheckCircle, Hash, ChevronRight, Package, Star } from "lucide-react";

// Sample data
const recentOrders = [
  { id: "ORD-7821", customer: "Rahul Sharma", amount: 1250, status: "completed", time: "2 min ago" },
  { id: "ORD-7820", customer: "Priya Patel", amount: 890, status: "preparing", time: "15 min ago" },
  { id: "ORD-7819", customer: "Amit Kumar", amount: 2100, status: "pending", time: "32 min ago" },
  { id: "ORD-7818", customer: "Sneha Gupta", amount: 650, status: "completed", time: "1 hr ago" },
];

const topProducts = [
  { name: "Butter Chicken", sales: 245, revenue: 48500, change: 12 },
  { name: "Paneer Tikka", sales: 189, revenue: 32400, change: 8 },
  { name: "Biryani", sales: 156, revenue: 28700, change: -3 },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: CheckCircle };
    case "preparing":
      return { bg: "bg-orange-500/10", text: "text-orange-400", icon: Clock };
    case "pending":
      return { bg: "bg-amber-500/10", text: "text-amber-400", icon: Clock };
    default:
      return { bg: "bg-slate-500/10", text: "text-slate-400", icon: Clock };
  }
};

function TableSection() {
  return (
    <div className="space-y-6">
      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                <p className="text-sm text-slate-400">Latest transactions</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr
                    key={order.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Hash className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-white">{order.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-300">{order.customer}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-semibold text-emerald-400">₹{order.amount}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusConfig.bg} ${statusConfig.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm text-slate-500">{order.time}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Top Products</h3>
                <p className="text-sm text-slate-400">Best performers this week</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {topProducts.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? "bg-gradient-to-br from-yellow-500 to-orange-500" :
                  index === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                  "bg-gradient-to-br from-amber-700 to-amber-800"
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{product.name}</h4>
                  <p className="text-xs text-slate-500">{product.sales} orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">₹{product.revenue.toLocaleString()}</p>
                <div className={`flex items-center justify-end gap-1 text-xs ${product.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  <TrendingUp className={`w-3 h-3 ${product.change < 0 ? "rotate-180" : ""}`} />
                  {Math.abs(product.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableSection;
