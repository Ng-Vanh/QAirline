import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Flights from "./pages/Flights/Flights";
import Bookings from "./pages/Bookings/Bookings";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/index";
import AdminLoginPage from "./pages/Admin/login/page";
import Reports from "./pages/Admin/report/page";
import CMSPage from "./pages/Admin/cms/page";
import UserManagement from "./pages/Admin/user/page";
import ManageAircraft from "./pages/Admin/aircraft/page";
import ManageFlights from "./pages/Admin/flights/page";
import AdminAirportManagement from "./pages/Admin/airports/page";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";
import AdminSidebar from "./components/AdminSidebar"; // Import AdminSidebar component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setIsAdminRoute(currentPath.startsWith('/admin'));
  }, []);

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect /admin to /admin/login */}
          <Route path="/admin" element={<Navigate to="/admin/login" />} />

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={
              isAuthenticated ? (
                <Navigate to="/admin/reports" />
              ) : (
                <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
              )
            }
          />

          {/* Admin Layout with Default Route */}
          {isAuthenticated ? (
            <Route path="/admin/*" element={<Admin />}>
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="flights" element={<ManageFlights />} />
              <Route path="aircraft" element={<ManageAircraft />} />
              <Route path="airports" element={<AdminAirportManagement />} />
              <Route path="cms" element={<CMSPage />} />
            </Route>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
          )}
        </Routes>
      </div>

      {/* Conditionally render Footer */}
      {!isAdminRoute && <Footer />}

      {/* Conditionally render Sidebar based on authentication */}
      {isAuthenticated && <AdminSidebar setIsAuthenticated={setIsAuthenticated} />}
    </>
  );
};

export default App;
