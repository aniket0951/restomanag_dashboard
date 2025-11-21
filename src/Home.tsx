import { useState } from "react";
// import { useNavigate } from "react-router-dom";

import Header from "./components/layouts/header";
import SideBar from "./components/layouts/sidebar";
import Dashboard from "./dashboard/dashboard";
import Orders from "./dashboard/orders";
import Restaurants from "./components/layouts/restaurants/restaurants";
import RestaurantFullDetails from "./components/layouts/restaurants/restaurant_full_details";
import { Outlet } from "react-router-dom";

function Home() {
  const [sideBarCollapsed, setsideBarCollapsed] = useState(false);
  const [currentPage, setcurrentPage] = useState("dashboard");
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500 md:flex-row"
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <SideBar
          collapsed={sideBarCollapsed}
          onToggle={() => setsideBarCollapsed(!sideBarCollapsed)}
          currentPage={currentPage}
          onPageChange={setcurrentPage}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            sidebarCollapsed={sideBarCollapsed}
            onToggleSidebar={() => setsideBarCollapsed(!sideBarCollapsed)}
          />
          {/* Page Content goes here */}
          <main className="flex-1 overflow-y-auto p-6 bg-transparent">
            {/*<Outlet />*/}
            {/*<Dashboard />*/}
            <div className="p-6 space-y-6">
              {currentPage === "dashboard" && <Dashboard />}
              {currentPage === "orders" && <Orders />}
              {currentPage === "restaurants" && <Restaurants />}
              {currentPage === "restaurantDetails" && <RestaurantFullDetails />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
