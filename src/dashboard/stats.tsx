import { ArrowDownLeft, ArrowUpRight, DollarSign } from "lucide-react";

// const stats = [
//   {
//     title: "Total Revenue",
//     value: "$ 1234",
//     change: "+12.5%",
//     trend: "up",
//     icon: DollarSign,
//     color: "from-emerald-500 to-teal-600",
//     bgColor: "bg-emerald-50 dark:bg-emrald-900/20",
//     textColor: "text-emerald-600 dark:text-emerald-400",
//   },
//   {
//     title: "Active Users",
//     value: "8,546",
//     change: "+8.5%",
//     trend: "up",
//     icon: Users,
//     color: "from-blue-500 to-indigo-600",
//     bgColor: "bg-blue-50 dark:bg-emrald-900/20",
//     textColor: "text-emerald-600 dark:text-emerald-400",
//   },
// ];

function StatusGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6
        border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20
        dark:hover:shadow-slate-900/20 transition-all duration-300 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              $ 12345
            </p>
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>23%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                vs Last Month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6
        border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20
        dark:hover:shadow-slate-900/20 transition-all duration-300 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Revenue
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              $ 12345
            </p>
            <div className="flex items-center space-x-2">
              <ArrowDownLeft className="w-4 h-4 text-red-600" />
              <span className={`text-sm font-semibold text-red`}>25%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                vs Last Month
              </span>
            </div>
          </div>
          <div
            className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group:hover:scale-110 transition-all duration-300`}
          >
            <DollarSign className="w-6 text-shadow-emerald-600" />
          </div>
        </div>

        {/* ProgressBar */}
        <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-emerald-500 to-teal-600
              rounded-full transition-all duration-100`}
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default StatusGrid;
