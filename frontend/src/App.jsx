import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Flights from "./pages/Flights/Flights";
import Bookings from "./pages/Bookings/Bookings";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/index";
// import AdminLoginPage from "./pages/Admin/login/page";
import Reports from "./pages/Admin/report/page";
import CMSPage from "./pages/Admin/cms/page";
import UserManagement from "./pages/Admin/user/page";
import ManageAircraft from "./pages/Admin/aircraft/page";
import ManageFlights from "./pages/Admin/flights/page";
import AdminAirportManagement from "./pages/Admin/airports/page";
import DetailPage from "./pages/Detail/DetailPage";
import AllNewsPage from "./pages/AllNewsPage/AllNewsPage";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";
import AdminSidebar from "./components/AdminSidebar";
import { useAuth } from "./components/contexts/AuthContext";

const App = () => {
  const { isAuthenticated, role } = useAuth();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setIsAdminRoute(currentPath.startsWith('/admin'));
    setIsAdminLogin(currentPath.startsWith('/admin/login'));
  }, [window.location.pathname]);

  return (
    <>
      {(!isAdminRoute || isAdminLogin) && <Navbar />}

      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/detail/:slug" element={<DetailPage />} />
          <Route path="/all-news" element={<AllNewsPage />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect /admin to /admin/reports if authenticated as admin */}
          <Route
            path="/admin"
            element={
              isAuthenticated && role === 'admin' ? (
                <Navigate to="/admin/reports" replace />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* Admin Login Route */}
          <Route
            path="/admin/login"
            element={
              isAuthenticated ? (
                role === 'admin' ? (
                  <Navigate to="/admin/reports" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Login />
              )
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              isAuthenticated && role === 'admin' ? (
                <Admin />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* Admin components */}
          <Route path="/admin/*" element={<Admin />}>
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="flights" element={<ManageFlights />} />
            <Route path="aircraft" element={<ManageAircraft />} />
            <Route path="airports" element={<AdminAirportManagement />} />
            <Route path="cms" element={<CMSPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>

      {/* Conditionally render Footer */}
      {!isAdminRoute && <Footer />}

      {/* Conditionally render Sidebar based on authentication */}
      {isAuthenticated && isAdminRoute && role === 'admin' && <AdminSidebar />}

    </>
  );
};

export default App;
