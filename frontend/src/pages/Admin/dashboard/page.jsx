import React from "react";
import { Link } from "react-router-dom";

import { Users, PlaneTakeoff, BarChart2, FileText, Plane, Clock, LandPlot } from "lucide-react";
import AdminSidebar from "~/components/AdminSidebar";
import Reports from '../report/page'
import "./Styles.css";

export default function AdminDashboard() {
    const adminFeatures = [
        { title: "User Management", icon: Users, link: "/admin/user" },
        { title: "Flight Management", icon: PlaneTakeoff, link: "/admin/flights" },
        { title: "Aircraft Management", icon: Plane, link: "/admin/aircraft" },
        { title: "Reports", icon: BarChart2, link: "/admin/reports" },
        { title: "Content Management", icon: FileText, link: "/admin/cms" },
        { title: "Airports Management", icon: LandPlot, link: "/admin/airports" },
    ];

    return (
        <div>
            {/* <AdminSidebar></AdminSidebar> */}
            {/* <Reports></Reports> */}
            <div className="dashboard-container">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <div className="dashboard-grid">
                    {adminFeatures.map((feature, index) => (
                        <Link key={index} to={feature.link} className="dashboard-card">
                            <div className="card-content">
                                <feature.icon className="card-icon" size={24} />
                                <span className="card-title">{feature.title}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>

    );
}
