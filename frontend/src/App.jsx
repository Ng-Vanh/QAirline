import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Flights from './pages/Flights/Flights';
import Bookings from './pages/Bookings/Bookings';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/dashboard/AdminDashboard';

const App = () => {

    return (
        <Router>
            <div>
                {/* <Navbar /> */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/flights" element={<Flights />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>

            </div>
        </Router>
    );
};

export default App;
