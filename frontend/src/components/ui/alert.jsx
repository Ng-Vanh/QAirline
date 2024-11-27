import * as React from "react";

const styles = {
    alertBase: {
        position: "relative",
        width: "100%",
        borderRadius: "0.5rem",
        border: "1px solid #ddd",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
    },
    alertDefault: {
        backgroundColor: "#f9f9f9", // Light background
        color: "#333", // Default text color
    },
    alertDestructive: {
        border: "1px solid rgba(255, 69, 58, 0.5)", // Red border
        color: "#ff453a", // Destructive text color
    },
    iconBase: {
        position: "absolute",
        left: "1rem",
        top: "1rem",
    },
    iconDestructive: {
        color: "#ff453a", // Destructive icon color
    },
    title: {
        marginBottom: "0.25rem",
        fontWeight: "500",
        lineHeight: "1.2",
        letterSpacing: "-0.02em",
    },
    description: {
        fontSize: "0.875rem",
        lineHeight: "1.5",
    },
};

const Alert = React.forwardRef(
    ({ className, variant = "default", ...props }, ref) => {
        const variantStyles =
            variant === "destructive" ? styles.alertDestructive : styles.alertDefault;

        return (
            <div
                ref={ref}
                role="alert"
                style={{ ...styles.alertBase, ...variantStyles }}
                className={className}
                {...props}
            />
        );
    }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        style={styles.title}
        className={className}
        {...props}
    />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        style={styles.description}
        className={className}
        {...props}
    />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
