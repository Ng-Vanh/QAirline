import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "~/components/AdminSidebar";
import Reports from "./report/page";
import Airports from "./airports/page"; // Example for other pages
import Flights from "./flights/page";
import UserManagement from "./user/page";
import ManageAircraft from "./aircraft/page";
import CMSPage from "./cms/page";
import AdminDashboard from "./dashboard/page";
import './styles.css'

const Admin = () => {
    return (
        <div className="admin-layout" >
            {/* Sidebar */}
            <AdminSidebar className="sideBar" />

            {/* Content */}
            <div className="admin-content" style={{ marginLeft: "16rem", padding: "1rem", height: "100vh" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Admin;
