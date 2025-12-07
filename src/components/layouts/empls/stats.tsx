import { type LucideIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useSideBarStore } from "../../../store/sidebar";

interface StatusGridProps {
  children: ReactNode;
}

interface AttendanceCountProps {
  title: string;
  count: number;
  icon: LucideIcon;
  icon_class: string;
}

const children_parent_div: string =
  "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group";

const children_title: string =
  "text-sm font-medium text-slate-600 dark:text-slate-400 mb-2";

export function AttendanceCounts({
  title,
  count,
  icon: Icon,
  icon_class,
}: AttendanceCountProps) {
  const sidbarstate = useSideBarStore((state) => state.sidebar);
  useEffect(() => {});
  return (
    <div className={children_parent_div}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={children_title}>{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            {count}
          </p>
        </div>
        <div
          className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group:hover:scale-110 transition-all duration-300`}
        >
          <Icon className={icon_class} />
        </div>
      </div>
    </div>
  );
}

function EmplStats({ children }: StatusGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Revenue */}
      {children}
    </div>
  );
}

export default EmplStats;
