import {
  ArrowDownLeft,
  BadgeCheck,
  BarChart3,
  DollarSign,
  Hourglass,
  PackagePlus,
  Wallet2,
  Clock,
  ChefHat,
  Coffee,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
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

const getOrderStatusConfig = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("pending")) {
    return {
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      progressGradient: "from-amber-500 to-orange-500",
      borderColor: "border-amber-500/30",
    };
  }
  if (lowerTitle.includes("preparing")) {
    return {
      icon: ChefHat,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      progressGradient: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/30",
    };
  }
  if (lowerTitle.includes("served")) {
    return {
      icon: Coffee,
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
      progressGradient: "from-cyan-500 to-blue-500",
      borderColor: "border-cyan-500/30",
    };
  }
  if (lowerTitle.includes("completed")) {
    return {
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/10 to-green-500/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      progressGradient: "from-emerald-500 to-green-500",
      borderColor: "border-emerald-500/30",
    };
  }
  if (lowerTitle.includes("cancelled")) {
    return {
      icon: XCircle,
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-500/10 to-rose-500/10",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      progressGradient: "from-red-500 to-rose-500",
      borderColor: "border-red-500/30",
    };
  }
  return {
    icon: BarChart3,
    gradient: "from-blue-500 to-purple-500",
    bgGradient: "from-blue-500/10 to-purple-500/10",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    progressGradient: "from-blue-500 to-purple-500",
    borderColor: "border-blue-500/30",
  };
};

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
  const isPositive = changes >= 0;
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-blue-500/20 dark:border-white/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Orders
            </p>
          </div>

          <p className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
            {value.toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(changes)}%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              vs Last Month
            </span>
          </div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(changes, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function Revenue({ value }: { value: number }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20 dark:border-white/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Wallet2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Revenue
            </p>
          </div>

          <p className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
            ₹{value.toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-3 h-3" />
              25%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              vs Last Month
            </span>
          </div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: "75%" }}
        />
      </div>
    </div>
  );
}

export function PendingOrders({
  count,
  currentPercentage,
}: {
  count: number;
  currentPercentage: number;
}) {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Pending Orders</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ {count}
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>
              {currentPercentage}%
            </span>
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

export function PreparingOrders({
  count,
  currentPercentage,
}: {
  count: number;
  currentPercentage: number;
}) {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Preparing Orders</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ {count}
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>
              {currentPercentage}%
            </span>
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

export function ServeOrders({
  count,
  currentPercentage,
}: {
  count: number;
  currentPercentage: number;
}) {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Serve Orders</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ {count}
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>
              {currentPercentage}%
            </span>
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

export function OrderStatus({
  title,
  count,
  currentPercentage,
}: {
  title: string;
  count: number;
  currentPercentage: number;
}) {
  const config = getOrderStatusConfig(title);
  const StatusIcon = config.icon;
  const isPositive = currentPercentage >= 0;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border ${config.borderColor} dark:border-white/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
    >
      {/* Background decoration */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}
            >
              <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
          </div>

          <p className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
            {count}
          </p>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(currentPercentage)}%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              vs Yesterday
            </span>
          </div>
        </div>

        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          <StatusIcon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${config.progressGradient} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(currentPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function CompletedOrders({
  totalOrders,
  currentPercentage,
}: {
  totalOrders: number;
  currentPercentage: number;
}) {
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>Completed Orders</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            $ {totalOrders}
          </p>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span className={childern_span_percentage}>
              {" "}
              {currentPercentage}%
            </span>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {children}
    </div>
  );
}

export default StatusGrid;
