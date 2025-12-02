import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  ListOrdered,
  School,
  Users,
  Zap,
  Hotel,
} from "lucide-react";
import { useState } from "react";
import { useUserStore, restaurantStore } from "../../store/user_store";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    lable: "Dashboard",
    active: true,
    badge: "new",
    link: "/dashboard",
  },
  {
    id: "analytics",
    icon: BarChart3,
    lable: "Analytics",
    active: false,
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
    lable: "Customers",
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
    lable: "Employees",
    link: "/dashboard/empl",
  },
  {
    id: "orders",
    icon: ListOrdered,
    lable: "Orders",
    link: "/test",
  },
  {
    id: "restaurants",
    icon: Hotel,
    lable: "Restaurants",
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
  onToggle: _onToggle, // eslint-disable-line @typescript-eslint/no-unused-vars
  currentPage: _currentPage, // eslint-disable-line @typescript-eslint/no-unused-vars
  onPageChange: _onPageChange, // eslint-disable-line @typescript-eslint/no-unused-vars
}: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [expanedItem, setexpanedItem] = useState(new Set(["analytics"]));
  const toggleExpanded = (itemid: string) => {
    const newExpanded = new Set(expanedItem);
    if (newExpanded.has(itemid)) {
      newExpanded.delete(itemid);
    } else {
      newExpanded.add(itemid);
    }
    setexpanedItem(newExpanded);
  };
  const user = useUserStore((state) => state.user);
  const restaurantstore = restaurantStore((state) => state.restaurant);

  return (
    <div
      className={`${collapsed ? "w-20" : "w-60"} transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80
      backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col
      relative z-10f`}
    >
      {/* LOGO */}

      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex
            items-center justify-center shadow-lg"
          >
            <Zap className="w-6 h-6 text-white" />
          </div>

          {/* Conditional Rendering */}
          {!collapsed && (
            <>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Nexus
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin Pannel
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation, Dynamic Menus */}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          return (
            <>
              <div key={item.id}>
                <button
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                    ${
                      location.pathname === item.link
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleExpanded(item.id);
                      navigate(item.link);
                    } else if (item.link) {
                      navigate(item.link);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    {!collapsed && (
                      <>
                        <span className="font-medium ml-2">{item.lable}</span>
                        {item.count && (
                          <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {!collapsed && item.submenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform`} />
                  )}
                </button>
                {/* SubMenu */}
                {!collapsed && item.submenu && expanedItem.has(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subitems) => {
                      return (
                        <button
                          className="w-full text-left p-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800
                        dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all"
                          onClick={() => {
                            navigate(subitems.link);
                          }}
                        >
                          {subitems.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900"
            alt="users"
            className="w-10 h-10 rounded-full ring-2 ring-blue-500"
          />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                    {user?.name || "Unknow"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {restaurantstore?.name || "Adminoistrator"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
