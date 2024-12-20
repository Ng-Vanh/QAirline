import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "~/components/AdminSidebar";

import './styles.css'

const Admin = () => {
    return (
        <div className="admin-layout" >
            <AdminSidebar className="sideBar" />

            <div className="admin-content" style={{ marginLeft: "16rem", padding: "1rem", height: "100vh" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Admin;
