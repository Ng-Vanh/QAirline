import Link from "next/link";
import { Home, Users, PlaneTakeoff, BarChart2, Bell, FileText } from "lucide-react";

export default function AdminSidebar() {
    const styles = {
        aside: {
            backgroundColor: "#1f2937", // bg-gray-800
            color: "#ffffff", // text-white
            width: "16rem", // w-64
            minHeight: "100vh", // min-h-screen
            padding: "1rem", // p-4
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
                <Link
                    href="/admin/dashboard"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <Home size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link
                    href="/admin/users"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <Users size={20} />
                    <span>User Management</span>
                </Link>
                <Link
                    href="/admin/flights"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <PlaneTakeoff size={20} />
                    <span>Flight Management</span>
                </Link>
                <Link
                    href="/admin/reports"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <BarChart2 size={20} />
                    <span>Reports</span>
                </Link>
                <Link
                    href="/admin/announcements"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <Bell size={20} />
                    <span>Announcements</span>
                </Link>
                <Link
                    href="/admin/cms"
                    style={styles.link}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <FileText size={20} />
                    <span>CMS</span>
                </Link>
            </nav>
        </aside>
    );
}
