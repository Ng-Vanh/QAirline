import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Flights from './pages/Flights/Flights';
import Booking from './pages/Booking/Booking';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/dashboard/page';
import Reports from './pages/Admin/report/page';
import CMSPage from './pages/Admin/cms/page';
import UserManagement from './pages/Admin/user/page';
import ManageAircraft from './pages/Admin/aircraft/page';
import ManageFlights from './pages/Admin/flights/page';
import AdminAirportManagement from './pages/Admin/airports/page';
import Admin from './pages/Admin/index';
import AdminSidebar from './components/AdminSidebar';
import Header from './components/Header';
import Footer from './components/Footer';
const App = () => {

    return (
        <Router>
            <div>
                {/* <Navbar /> */}
                {/* <Header></Header> */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/flights" element={<Flights />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/*" element={<Admin />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="flights" element={<ManageFlights />} />
                        <Route path="aircraft" element={<ManageAircraft />} />
                        <Route path="airports" element={<AdminAirportManagement />} />
                        <Route path="cms" element={<CMSPage />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="*" element={<Navigate to="/admin/reports" />} />
                    </Route>


                    {/* <Route path="/admin/reports" element={<Reports />} />
                    <Route path="/admin/cms" element={<CMSPage />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/aircraft" element={<ManageAircraft />} />
                    <Route path="/admin/flights" element={<ManageFlights />} />
                    <Route path="/admin/airports" element={<AdminAirportManagement />} /> */}

                </Routes>
            </div>
        </Router>
    );
};

export default App;
