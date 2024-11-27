import React from "react";

const styles = {
    badgeBase: {
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "0.375rem", // Rounded corners
        borderWidth: "1px",
        padding: "0.125rem 0.625rem", // px-2.5 py-0.5
        fontSize: "0.75rem", // text-xs
        fontWeight: "600", // font-semibold
        transition: "background-color 0.2s ease, color 0.2s ease",
        outline: "none",
    },
    default: {
        backgroundColor: "#3b82f6", // Primary background
        color: "#ffffff", // Primary foreground
        borderColor: "transparent",
        boxShadow: "0px 2px 4px rgba(59, 130, 246, 0.4)",
    },
    secondary: {
        backgroundColor: "#e5e7eb", // Secondary background
        color: "#111827", // Secondary foreground
        borderColor: "transparent",
    },
    destructive: {
        backgroundColor: "#ef4444", // Destructive background
        color: "#ffffff", // Destructive foreground
        borderColor: "transparent",
        boxShadow: "0px 2px 4px rgba(239, 68, 68, 0.4)",
    },
    outline: {
        color: "#111827", // Foreground color
        borderColor: "#d1d5db", // Outline border
    },
};

function Badge({ className, variant = "default", ...props }) {
    // Determine styles based on variant
    const variantStyles =
        variant === "secondary"
            ? styles.secondary
            : variant === "destructive"
                ? styles.destructive
                : variant === "outline"
                    ? styles.outline
                    : styles.default;

    return (
        <div
            className={className}
            style={{ ...styles.badgeBase, ...variantStyles }}
            {...props}
        />
    );
}

export { Badge };
