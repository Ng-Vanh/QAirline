import React from "react";
import "./Toast.css";

function Toast({ id, title, description, action, open, onOpenChange }) {
    if (!open) return null;

    // Dynamic background color based on the title
    const backgroundColor = {
        Success: "#28a745", // Green for Success
        Error: "#dc3545", // Red for Error
        Info: "#17a2b8", // Blue for Info
        Warning: "#ffc107", // Yellow for Warning
    }[title] || "#ffffff"; // Default to white if no title matches

    return (
        <div
            className="toast"
            style={{
                backgroundColor,
            }}
        >
            <div>
                {title && <strong className="toast-title">{title}</strong>}
                {description && <p className="toast-description">{description}</p>}
            </div>
            <div className="toast-actions">
                {action}
                <button className="toast-close" onClick={() => onOpenChange(false)}>
                    ×
                </button>
            </div>
        </div>
    );
}

export default Toast;
