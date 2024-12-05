import { Link } from "react-router-dom";

import { Home, Users, PlaneTakeoff, BarChart2, Bell, FileText, LandPlot, Plane } from "lucide-react";

export default function AdminSidebar() {
    const styles = {
        aside: {
            backgroundColor: "#009bd6", // bg-gray-800
            color: "#ffffff", // text-white
            width: "15rem", // w-64
            height: "100vh", // 100% height of viewport
            position: "fixed", // Fixed position
            top: "0", // Stick to the top
            left: "0", // Stick to the left
            padding: "1rem", // p-4
            display: "flex",
            flexDirection: "column",
        },
        nav: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem", // space-y-4
        },
        link: {
            display: "flex",
            alignItems: "center", // flex items-center
            gap: "0.5rem", // space-x-2
            padding: "0.5rem", // p-2
            borderRadius: "0.375rem", // rounded
            textDecoration: "none", // remove underline
            color: "#ffffff", // text color
            transition: "background-color 0.2s ease",
        },
        linkHover: {
            backgroundColor: "#374151", // hover:bg-gray-700
        },
    };

    return (
        <aside style={styles.aside}>
            <nav style={styles.nav}>
                {/* Dashboard */}
                {/* <Link
                    to="/admin/dashboard"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <Home size={20} />
                    <span>Dashboard</span>
                </Link> */}

                {/* User Management */}
                <Link
                    to="/admin/users"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <Users size={20} />
                    <span>User Management</span>
                </Link>

                {/* Flight Management */}
                <Link
                    to="/admin/flights"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <PlaneTakeoff size={20} />
                    <span>Flight Management</span>
                </Link>

                {/* Aircraft Management */}
                <Link
                    to="/admin/aircraft"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <Plane size={20} />
                    <span>Aircraft Management</span>
                </Link>

                {/* Airport Management */}
                <Link
                    to="/admin/airports"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <LandPlot size={20} />
                    <span>Airport Management</span>
                </Link>

                {/* CMS */}
                <Link
                    to="/admin/cms"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <FileText size={20} />
                    <span>CMS</span>
                </Link>

                {/* Reports */}
                <Link
                    to="/admin/reports"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <BarChart2 size={20} />
                    <span>Reports</span>
                </Link>
            </nav>
        </aside>
    );
}
