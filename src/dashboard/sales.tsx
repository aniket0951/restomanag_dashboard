import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChartIcon } from "lucide-react";

const data = [
  {
    name: "Main Course",
    value: 45,
    color: "#3b82f6",
    amount: "₹45,000",
  },
  {
    name: "Starters",
    value: 30,
    color: "#8b5cf6",
    amount: "₹30,000",
  },
  {
    name: "Beverages",
    value: 15,
    color: "#10b981",
    amount: "₹15,000",
  },
  {
    name: "Desserts",
    value: 10,
    color: "#f59e0b",
    amount: "₹10,000",
  },
];

function Sales() {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <PieChartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Sales by Category</h3>
            <p className="text-sm text-slate-400">Revenue distribution</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Pie Chart */}
        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 41, 59, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">₹1L</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 mt-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{item.amount}</span>
                <span className="text-sm font-semibold text-white min-w-[40px] text-right">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sales;
