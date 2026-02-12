import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface StatusGridProps {
  children: ReactNode;
}

interface AttendanceCountProps {
  title: string;
  count: number;
  icon: LucideIcon;
  icon_class?: string;
  gradient?: string;
  percentage?: number;
}

const getAttendanceConfig = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("total")) {
    return {
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      progressGradient: "from-indigo-500 to-purple-500",
      borderColor: "border-indigo-500/30",
    };
  }
  if (lowerTitle.includes("present")) {
    return {
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/10 to-green-500/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      progressGradient: "from-emerald-500 to-green-500",
      borderColor: "border-emerald-500/30",
    };
  }
  if (lowerTitle.includes("absent")) {
    return {
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-500/10 to-rose-500/10",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      progressGradient: "from-red-500 to-rose-500",
      borderColor: "border-red-500/30",
    };
  }
  if (lowerTitle.includes("late")) {
    return {
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      progressGradient: "from-amber-500 to-orange-500",
      borderColor: "border-amber-500/30",
    };
  }
  return {
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    progressGradient: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30",
  };
};

export function AttendanceCounts({
  title,
  count,
  icon: Icon,
  percentage = 0,
}: AttendanceCountProps) {
  const config = getAttendanceConfig(title);
  const isPositive = percentage >= 0;

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
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
          </div>

          <p className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
            {count}
          </p>

          {percentage !== 0 && (
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
                {Math.abs(percentage)}%
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                vs Yesterday
              </span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-br ${config.progressGradient} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(Math.abs(percentage) || 50, 100)}%` }}
        />
      </div>
    </div>
  );
}

function EmplStats({ children }: StatusGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

export default EmplStats;
