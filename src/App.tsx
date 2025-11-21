import { Route, Routes, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./auth/login";
import Home from "./Home";
import OwnerSignUp from "./auth/owner_signup";

import { Navigate } from "react-router-dom";
import RestaurantFullDetails from "./components/layouts/restaurants/restaurant_full_details";
import Dashboard from "./dashboard/dashboard";
import Restaurants from "./components/layouts/restaurants/restaurants";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/" replace />; // redirect to login
  }

  return children;
}

function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500
    "
    >
      <nav style={{ display: "flex", gap: "10px" }}>
        <Link to="/"></Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<OwnerSignUp />} />

        <Route path="/dashboard" element={<Home />}>
          {/* Dashboard pages go inside Home */}
          <Route index element={<Dashboard />} />
          {/*<Route path="orders" element={<Orders />} />*/}
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="restaurants/:id" element={<RestaurantFullDetails />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
