import { Plane, Clock, Calendar, MapPin } from "lucide-react";

export default function FlightDetails({
    flightNumber,
    departureCity,
    arrivalCity,
    departureTime,
    arrivalTime,
    aircraft,
    status,
    gate,
    terminal,
}) {
    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);

    const formatDate = (date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const formatTime = (date) =>
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "on time":
                return { color: "#16a34a" }; // green-600
            case "delayed":
                return { color: "#ca8a04" }; // yellow-600
            case "cancelled":
                return { color: "#dc2626" }; // red-600
            default:
                return { color: "#3b82f6" }; // blue-600
        }
    };

    const styles = {
        container: {
            backgroundColor: "#ffffff", // bg-white
            padding: "1.5rem", // p-6
            borderRadius: "0.5rem", // rounded-lg
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // shadow-md
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem", // mb-4
        },
        flightTitle: {
            fontSize: "1.5rem", // text-2xl
            fontWeight: "bold", // font-bold
        },
        statusBadge: {
            padding: "0.25rem 0.75rem", // px-3 py-1
            borderRadius: "9999px", // rounded-full
            fontSize: "0.875rem", // text-sm
            fontWeight: "500", // font-medium
        },
        section: {
            marginBottom: "1rem", // mb-4
        },
        title: {
            fontSize: "1.125rem", // text-lg
            fontWeight: "600", // font-semibold
            marginBottom: "0.5rem", // mb-2
        },
        detail: {
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem", // mb-2
        },
        icon: {
            marginRight: "0.5rem", // mr-2
        },
        footer: {
            marginTop: "1rem", // mt-4
            paddingTop: "1rem", // pt-4
            borderTop: "1px solid #e5e7eb", // border-t
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.flightTitle}>Flight {flightNumber}</h2>
                <span style={{ ...styles.statusBadge, ...getStatusColor(status) }}>
                    {status}
                </span>
            </div>
            <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <h3 style={styles.title}>Departure</h3>
                    <div style={styles.detail}>
                        <MapPin style={styles.icon} size={18} />
                        <span>{departureCity}</span>
                    </div>
                    <div style={styles.detail}>
                        <Calendar style={styles.icon} size={18} />
                        <span>{formatDate(departureDate)}</span>
                    </div>
                    <div style={styles.detail}>
                        <Clock style={styles.icon} size={18} />
                        <span>{formatTime(departureDate)}</span>
                    </div>
                    {gate && (
                        <div style={styles.detail}>
                            <span style={{ fontWeight: "500", marginRight: "0.5rem" }}>Gate:</span>
                            <span>{gate}</span>
                        </div>
                    )}
                    {terminal && (
                        <div style={styles.detail}>
                            <span style={{ fontWeight: "500", marginRight: "0.5rem" }}>Terminal:</span>
                            <span>{terminal}</span>
                        </div>
                    )}
                </div>
                <div>
                    <h3 style={styles.title}>Arrival</h3>
                    <div style={styles.detail}>
                        <MapPin style={styles.icon} size={18} />
                        <span>{arrivalCity}</span>
                    </div>
                    <div style={styles.detail}>
                        <Calendar style={styles.icon} size={18} />
                        <span>{formatDate(arrivalDate)}</span>
                    </div>
                    <div style={styles.detail}>
                        <Clock style={styles.icon} size={18} />
                        <span>{formatTime(arrivalDate)}</span>
                    </div>
                </div>
            </div>
            <div style={styles.footer}>
                <div style={styles.detail}>
                    <Plane style={styles.icon} size={18} />
                    <span style={{ fontWeight: "500", marginRight: "0.5rem" }}>Aircraft:</span>
                    <span>{aircraft}</span>
                </div>
            </div>
        </div>
    );
}
