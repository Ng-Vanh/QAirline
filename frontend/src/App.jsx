import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Flights from "./pages/Flights/Flights";
import Booking from "./pages/Booking/Booking";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/index";
import AdminLoginPage from "./pages/Admin/login/page";
import Reports from "./pages/Admin/report/page";
import CMSPage from "./pages/Admin/cms/page";
import UserManagement from "./pages/Admin/user/page";
import ManageAircraft from "./pages/Admin/aircraft/page";
import ManageFlights from "./pages/Admin/flights/page";
import AdminAirportManagement from "./pages/Admin/airports/page";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

    return (
        <Router>
            <div>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/flights" element={<Flights />} />
                    <Route path="/booking" element={<Booking />} />
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
                            <Route index element={<Navigate to="reports" />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="flights" element={<ManageFlights />} />
                            <Route path="aircraft" element={<ManageAircraft />} />
                            <Route path="airports" element={<AdminAirportManagement />} />
                            <Route path="cms" element={<CMSPage />} />
                            <Route path="*" element={<Navigate to="reports" />} />
                        </Route>
                    ) : (
                        <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
