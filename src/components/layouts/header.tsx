import {
  Bell,
  ChevronDown,
  Menu,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
  Store,
  Command,
} from "lucide-react";
import { useUserStore, restaurantStore } from "../../store/user_store";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

type HeaderProps = {
  onToggleSidebar: () => void;
};

function Header({ onToggleSidebar }: HeaderProps) {
  const user = useUserStore((state) => state.user);
  const restaurantstore = restaurantStore((state) => state.restaurant);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const location = useLocation();

  const btnRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/order")) return "Orders";
    if (path.includes("/empl/attendance")) return "Attendance";
    if (path.includes("/empl")) return "Employees";
    if (path.includes("/categories")) return "Categories";
    if (path.includes("/menu")) return "Menu";
    if (path.includes("/table")) return "Tables";
    if (path.includes("/restaurants")) return "Restaurants";
    return "Dashboard";
  };

  // Outside click handler
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;

      if (
        btnRef.current &&
        !btnRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Toggle dropdown
  const toggleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.right - 220,
      });
    }

    setOpen((prev) => !prev);
  };

  const logOut = () => {
    localStorage.clear();
    restaurantStore.setState({ restaurant: null });
    navigate("/");
  };

  const displayProfile = () => {
    const path: string = "/dashboard/restaurants/";
    const currentPath: string = location.pathname;
    if (currentPath.startsWith(path)) {
      navigate(path + restaurantstore?.id, { replace: true });
      window.location.reload();
    } else {
      navigate(path + restaurantstore?.id);
    }
    setOpen(false);
  };

  const createNewRestaurant = () => {
    navigate("/dashboard/restaurants/create");
  };

  return (
    <>
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-white/5 px-6 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              onClick={onToggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">
                  {getPageTitle()}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-md border border-blue-500/20">
                  Beta
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Welcome back, <span className="text-slate-400">{user?.name?.split(" ")[0] || "User"}</span>
              </p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-11 pr-20 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                <Command className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-500">K</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* New Button */}
            <button
              className="hidden lg:flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              onClick={() => createNewRestaurant()}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New</span>
            </button>

            {/* Icon Buttons */}
            <div className="flex items-center gap-1">
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 group-hover:scale-110 transition-transform">
                  3
                </span>
              </button>

              {/* Settings */}
              <button className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2" />

            {/* User Profile */}
            <div
              ref={btnRef}
              onClick={toggleDropdown}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900"
                  alt="User"
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="hidden md:block min-w-0">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">
                  {user?.name || "Unknown"}
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[100px]">
                  {restaurantstore?.name || "Admin"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DROPDOWN IN PORTAL */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            style={{ top: coords.top, left: coords.left }}
            className="fixed w-56 bg-slate-800 border border-white/10 shadow-2xl shadow-black/50 rounded-xl py-2 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-medium text-white">{user?.name || "Unknown"}</p>
              <p className="text-xs text-slate-500">{user?.email || "admin@example.com"}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                onClick={() => displayProfile()}
              >
                <User className="w-4 h-4" />
                <span>View Profile</span>
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                onClick={() => {
                  navigate("/dashboard/restaurants");
                  setOpen(false);
                }}
              >
                <Store className="w-4 h-4" />
                <span>My Restaurants</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={logOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default Header;
