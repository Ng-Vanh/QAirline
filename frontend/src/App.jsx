import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Flights from './pages/Flights/Flights';
import Booking from './pages/Booking/Booking';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Navbar from './components/Navbar/Navbar'
import Modal from './components/Modal/Modal';

const App = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/flights" element={<Flights />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
                <div>
                    {/* Button để mở Modal */}
                    <button onClick={() => setModalOpen(true)}>Open Modal</button>

                    {/* Modal component */}
                    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                        <h1>Are you sure?</h1>
                        <p>Do you really want to proceed?</p>
                    </Modal>
                </div>
            </div>
        </Router>
    );
};

export default App;
