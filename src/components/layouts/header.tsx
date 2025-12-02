import {
  Bell,
  ChevronDown,
  Menu,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { useUserStore, restaurantStore } from "../../store/user_store";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onToggleSidebar: () => void;
};

function Header({ onToggleSidebar }: HeaderProps) {
  const user = useUserStore((state) => state.user);
  const restaurantstore = restaurantStore((state) => state.restaurant);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const btnRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

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
        left: rect.right - 180,
      });
    }

    setOpen((prev) => !prev);
  };

  const logOut = () => {
    localStorage.clear();
    restaurantStore.setState({ restaurant: null });
    navigate("/");
  };

  return (
    <>
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={onToggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:block">
              <h1
                className="text-2xl font-black text-slate-800 dark:text-white p-1.8"
                style={{ fontSize: "1.0rem" }}
              >
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">Welcome back</p>
            </div>
          </div>

          {/* Center */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Anything"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border
                border-slate-200 dark:border-slate-700 rounded-xl text-slate-800
                dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3">
            <button
              className="hidden lg:flex items-center space-x-2 py-2 px-4
              bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow
              transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New</span>
            </button>

            <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Sun className="w-5 h-5" />
            </button>

            <button className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div
              ref={btnRef}
              onClick={toggleDropdown}
              className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a..."
                alt="User"
                className="w-8 h-8 rounded-full ring-2 ring-blue-500"
              />
              <div className="hidden md:block min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  {user?.name || "Unknown"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {restaurantstore?.name || "Administrator"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
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
            className="fixed w-48 bg-white dark:bg-slate-800 shadow-xl rounded-xl py-2
                       border border-slate-200 dark:border-slate-700 z-[9999] animate-fadeIn"
          >
            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400">
              Settings
            </button>
            <button
              onClick={logOut}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400"
            >
              Logout
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default Header;
