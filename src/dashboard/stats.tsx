import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  DollarSign,
  Hourglass,
  PackagePlus,
  Wallet2,
} from "lucide-react";
import type { ReactNode } from "react";

const children_parent_div: string =
  "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group";

const children_title: string =
  "text-sm font-medium text-slate-600 dark:text-slate-400 mb-2";

const childern_span_percentage: string =
  "text-sm font-semibold text-red dark:text-red-600";

const children_doller_sign: string =
  "w-6 text-shadow-emerald-600 dark:text-emerald-800";

interface StatusGridProps {
  children: ReactNode;
}

export function OrderStats({
  value,
  changes,
}: {
  value: number;
  changes: number;
}) {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Total Orders</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ {value}
          </p>
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span className={childern_span_percentage}>{changes} %</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              vs Last Month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Revenue({ value }: { value: number }) {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Revenue</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ {value}
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>25%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              vs Last Month
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group:hover:scale-110 transition-all duration-300`}
        >
          <DollarSign className={children_doller_sign} />
        </div>
      </div>

      <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-emerald-500 to-teal-600
            rounded-full transition-all duration-100`}
          style={{ width: "75%" }}
        ></div>
      </div>
    </div>
  );
}

export function OrderInit() {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Order Initiated</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ 123
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>25%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              vs Yesterday
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group:hover:scale-110 transition-all duration-300`}
        >
          <PackagePlus className={children_doller_sign} />
        </div>
      </div>

      <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-emerald-500 to-teal-600
            rounded-full transition-all duration-100`}
          style={{ width: "75%" }}
        ></div>
      </div>
    </div>
  );
}

export function PendingOrders() {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Pending Orders</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ 123
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>25%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              vs Yesterday
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group:hover:scale-110 transition-all duration-300`}
        >
          <Hourglass className={`${children_doller_sign} dark:text-red-600`} />
        </div>
      </div>

      <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-emerald-500 to-teal-600
            rounded-full transition-all duration-100`}
          style={{ width: "75%" }}
        ></div>
      </div>
    </div>
  );
}

export function CompletedOrders() {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Completed Orders</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ 123
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>25%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              vs Yesterday
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group:hover:scale-110 transition-all duration-300`}
        >
          <BadgeCheck className={children_doller_sign} />
        </div>
      </div>

      <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-emerald-500 to-teal-600
            rounded-full transition-all duration-100`}
          style={{ width: "75%" }}
        ></div>
      </div>
    </div>
  );
}

export function CurrentDayRevenue() {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Today Revenue</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ 2343
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>25%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              vs Yesterday
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group:hover:scale-110 transition-all duration-300`}
        >
          <Wallet2
            className={`${children_doller_sign} dark:text-emerald-800`}
          />
        </div>
      </div>

      <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-emerald-500 to-teal-600
            rounded-full transition-all duration-100`}
          style={{ width: "75%" }}
        ></div>
      </div>
    </div>
  );
}

function StatusGrid({ children }: StatusGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Revenue */}
      {children}
    </div>
  );
}

export default StatusGrid;
