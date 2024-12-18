import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/contexts/AuthContext";
import { Users, PlaneTakeoff, BarChart2, FileText, LandPlot, Plane, LogOut } from "lucide-react";

export default function AdminSidebar({ setIsAuthenticated }) { // Add the setIsAuthenticated prop
    const { logout } = useAuth();
    const navigate = useNavigate();

    const styles = {
        aside: {
            backgroundColor: "#009bd6",
            color: "#ffffff",
            width: "15rem",
            height: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        },
        nav: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
        link: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            borderRadius: "0.375rem",
            textDecoration: "none",
            color: "#ffffff",
            transition: "background-color 0.2s ease",
        },
        linkHover: {
            backgroundColor: "#374151",
        },
        logout: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            borderRadius: "0.375rem",
            textDecoration: "none",
            color: "#ffffff",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
        },
    };

    const handleLogout = () => {
        logout();
        // navigate("/admin/login");
    };

    return (
        <aside style={styles.aside}>
            {/* Navigation Links */}
            <nav style={styles.nav}>
                <Link to="/admin/users" style={styles.link}>
                    <Users size={20} />
                    <span>User Management</span>
                </Link>

                <Link to="/admin/flights" style={styles.link}>
                    <PlaneTakeoff size={20} />
                    <span>Flight Management</span>
                </Link>

                <Link to="/admin/aircraft" style={styles.link}>
                    <Plane size={20} />
                    <span>Aircraft Management</span>
                </Link>

                <Link to="/admin/airports" style={styles.link}>
                    <LandPlot size={20} />
                    <span>Airport Management</span>
                </Link>

                <Link to="/admin/cms" style={styles.link}>
                    <FileText size={20} />
                    <span>CMS</span>
                </Link>

                <Link to="/admin/reports" style={styles.link}>
                    <BarChart2 size={20} />
                    <span>Reports</span>
                </Link>
            </nav>

            {/* Logout Button */}
            <div
                style={styles.logout}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={handleLogout} // Gọi hàm logout khi click
            >
                <LogOut size={20} />
                <span>Logout</span>
            </div>
        </aside>
    );
}
