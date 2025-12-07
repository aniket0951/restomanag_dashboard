import { useState } from "react";
// import { useNavigate } from "react-router-dom";

import Header from "./components/layouts/header";
import SideBar from "./components/layouts/sidebar";

import { Outlet } from "react-router-dom";
import { useSideBarStore, type SideBarState } from "./store/sidebar";

function Home() {
  const [sideBarCollapsed, setsideBarCollapsed] = useState(false);
  const [currentPage, setcurrentPage] = useState("dashboard");
  const sidebarStore = useSideBarStore((state) => state.setSideBarState);
  const updateSideBarCollapsed = (state: boolean) => {
    const currentState: SideBarState = {
      open: !sideBarCollapsed,
    };
    sidebarStore(currentState);
    setsideBarCollapsed(state);
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500 md:flex-row"
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <SideBar
          collapsed={sideBarCollapsed}
          // onToggle={() => setsideBarCollapsed(!sideBarCollapsed)}
          onToggle={() => updateSideBarCollapsed(!sideBarCollapsed)}
          currentPage={currentPage}
          onPageChange={setcurrentPage}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            // sidebarCollapsed={sideBarCollapsed}
            // onToggleSidebar={() => setsideBarCollapsed(!sideBarCollapsed)}
            onToggleSidebar={() => updateSideBarCollapsed(!sideBarCollapsed)}
          />
          {/* Page Content goes here */}
          <main className="flex-1 overflow-y-auto p-6 bg-transparent">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
