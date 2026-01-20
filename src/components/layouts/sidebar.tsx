import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  ListOrdered,
  School,
  Users,
  Zap,
  Hotel,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useUserStore, restaurantStore } from "../../store/user_store";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    badge: "new",
    link: "/dashboard",
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    badge: "new",
    count: "23.4k",
    link: "/test",
    submenu: [
      {
        id: "overview",
        label: "Overview",
        link: "/test",
      },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Customers",
    count: "1.4k",
    link: "/test",
    submenu: [
      {
        id: "all-users",
        label: "All Users",
        link: "/dashboard/categories",
      },
      {
        id: "role",
        label: "Role & Permission",
        link: "/dashboard/categories",
      },
    ],
  },
  {
    id: "employee",
    icon: School,
    label: "Employees",
    link: "/dashboard/empl",
    submenu: [
      {
        id: "attendance",
        label: "Attendance",
        link: "/dashboard/empl/attendance",
      },
    ],
  },
  {
    id: "orders",
    icon: ListOrdered,
    label: "Orders",
    link: "/dashboard/order",
  },
  {
    id: "restaurants",
    icon: Hotel,
    label: "Restaurants",
    link: "/dashboard/restaurants",
    submenu: [
      {
        id: "category",
        label: "Categories",
        link: "/dashboard/categories",
      },
      {
        id: "menu",
        label: "Menu",
        link: "/dashboard/menu",
      },
      {
        id: "tables",
        label: "Tables",
        link: "/dashboard/table",
      },
    ],
  },
];

type SideBarProps = {
  collapsed: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
};

function SideBar({
  collapsed,
  onToggle: _onToggle,
  currentPage: _currentPage,
  onPageChange: _onPageChange,
}: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedItem, setExpandedItem] = useState(new Set(["analytics"]));

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItem);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItem(newExpanded);
  };

  const user = useUserStore((state) => state.user);
  const restaurantstore = restaurantStore((state) => state.restaurant);

  const isActiveRoute = (link: string) => location.pathname === link;
  const isParentActive = (item: (typeof menuItems)[0]) => {
    if (isActiveRoute(item.link)) return true;
    if (item.submenu) {
      return item.submenu.some((sub) => isActiveRoute(sub.link));
    }
    return false;
  };

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"} transition-all duration-300 ease-in-out
      bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
      border-r border-white/5 flex flex-col relative z-10 h-screen`}
    >
      {/* Logo Section */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Nexus
              </h2>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="mb-4">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Main Menu
            </p>
          )}

          {menuItems.map((item) => {
            const isActive = isParentActive(item);
            const isExpanded = expandedItem.has(item.id);

            return (
              <div key={item.id} className="mb-1">
                <button
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleExpanded(item.id);
                    }
                    navigate(item.link);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      <item.icon
                        className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                      />
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md uppercase">
                            {item.badge}
                          </span>
                        )}
                        {item.count && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-slate-300 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {!collapsed && item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {!collapsed && item.submenu && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-5 pl-4 mt-1 space-y-1 border-l border-white/10">
                      {item.submenu.map((subitem) => {
                        const isSubActive = isActiveRoute(subitem.link);
                        return (
                          <button
                            key={subitem.id}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200
                              ${
                                isSubActive
                                  ? "text-white bg-white/10"
                                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                              }`}
                            onClick={() => navigate(subitem.link)}
                          >
                            <ChevronRight
                              className={`w-3 h-3 ${isSubActive ? "text-blue-400" : ""}`}
                            />
                            <span>{subitem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5">
        {/* Settings Button */}
        {!collapsed && (
          <button className="w-full flex items-center gap-3 p-3 mb-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200">
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
              <Settings className="w-[18px] h-[18px]" />
            </div>
            <span className="font-medium text-sm">Settings</span>
          </button>
        )}

        {/* User Profile */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent
          hover:from-white/10 transition-all duration-200 cursor-pointer group`}
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900"
              alt="User"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-200"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Unknown"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {restaurantstore?.name || "Administrator"}
                </p>
              </div>
              <button className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
