import { Clock, UserPlus, ShoppingCart, CheckCircle, Bell, ChevronRight, Activity } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    description: "Order #7821 from Rahul Sharma",
    time: "2 min ago",
    icon: ShoppingCart,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
  },
  {
    id: 2,
    type: "completed",
    title: "Order Completed",
    description: "Order #7819 delivered successfully",
    time: "15 min ago",
    icon: CheckCircle,
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-400",
  },
  {
    id: 3,
    type: "user",
    title: "New Customer",
    description: "Priya Patel registered",
    time: "32 min ago",
    icon: UserPlus,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
  },
  {
    id: 4,
    type: "alert",
    title: "Low Stock Alert",
    description: "Paneer running low",
    time: "1 hr ago",
    icon: Bell,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-400",
  },
];

function ActivityFeed() {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Activity Feed</h3>
              <p className="text-sm text-slate-400">Recent activities</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-4 space-y-2">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <IconComponent className={`w-5 h-5 ${activity.textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">
                  {activity.title}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activity.color} flex-shrink-0 mt-2`} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          View All Activities
        </button>
      </div>
    </div>
  );
}

export default ActivityFeed;
