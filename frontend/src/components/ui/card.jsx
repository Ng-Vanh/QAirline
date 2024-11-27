import React from "react";

const styles = {
    card: {
        borderRadius: "1rem",
        border: "1px solid #e5e7eb", // Light gray border
        backgroundColor: "#ffffff", // Card background
        color: "#1f2937", // Card foreground
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Shadow
    },
    cardHeader: {
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem", // Space-y-1.5
        padding: "1.5rem", // p-6
    },
    cardTitle: {
        fontWeight: "600", // Font-semibold
        lineHeight: "1.25", // Leading-none
        letterSpacing: "-0.02em", // Tracking-tight
    },
    cardDescription: {
        fontSize: "0.875rem", // Text-sm
        color: "#6b7280", // Muted foreground
    },
    cardContent: {
        padding: "1.5rem", // p-6
        paddingTop: "0", // pt-0
    },
    cardFooter: {
        display: "flex",
        alignItems: "center",
        padding: "1.5rem", // p-6
        paddingTop: "0", // pt-0
    },
};

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} style={styles.card} className={className} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} style={styles.cardHeader} className={className} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} style={styles.cardTitle} className={className} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        style={styles.cardDescription}
        className={className}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} style={styles.cardContent} className={className} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} style={styles.cardFooter} className={className} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
