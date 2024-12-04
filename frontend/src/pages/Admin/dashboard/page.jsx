import React from "react";
import { Link } from "react-router-dom";

import { Users, PlaneTakeoff, BarChart2, FileText, Plane, Clock, LandPlot } from "lucide-react";
import AdminSidebar from "~/components/AdminSidebar";
import Reports from '../report/page'
import dbStyle from "./StylesDb.module.css";

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
            <div className={dbStyle.dashboard_container}>
                <h1 className={dbStyle.dashboard_title}>Admin Dashboard</h1>
                <div className={dbStyle.dashboard_grid}>
                    {adminFeatures.map((feature, index) => (
                        <Link key={index} to={feature.link} className={dbStyle.dashboard_card}>
                            <div className={dbStyle.card_content}>
                                <feature.icon className={dbStyle.card_icon} size={24} />
                                <span className={dbStyle.card_title}>{feature.title}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>

    );
}
