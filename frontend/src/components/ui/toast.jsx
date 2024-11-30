import React from "react";

const ToastProvider = ({ children }) => {
    return <div className="toast-provider">{children}</div>;
};

const ToastViewport = React.forwardRef(({ className, style, ...props }, ref) => (
    <div
        ref={ref}
        style={{
            position: "fixed",
            top: "0",
            right: "0",
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column-reverse",
            zIndex: 100,
            padding: "1rem",
            ...style,
        }}
        className={`toast-viewport ${className}`}
        {...props}
    />
));
ToastViewport.displayName = "ToastViewport";

const Toast = React.forwardRef(({ className, variant = "default", style, ...props }, ref) => (
    <div
        ref={ref}
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s, opacity 0.3s",
            backgroundColor: variant === "destructive" ? "#ffe5e5" : "#ffffff",
            borderColor: variant === "destructive" ? "#ff4d4d" : "#cccccc",
            color: variant === "destructive" ? "#ff4d4d" : "#000000",
            ...style,
        }}
        className={`toast ${className}`}
        {...props}
    />
));
Toast.displayName = "Toast";

const ToastAction = React.forwardRef(({ className, style, ...props }, ref) => (
    <button
        ref={ref}
        style={{
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: "1px solid #cccccc",
            borderRadius: "0.375rem",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "background-color 0.3s",
            ...style,
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        className={`toast-action ${className}`}
        {...props}
    />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef(({ className, style, ...props }, ref) => (
    <button
        ref={ref}
        style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            color: "#999999",
            ...style,
        }}
        className={`toast-close ${className}`}
        {...props}
    >
        ×
    </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, style, ...props }, ref) => (
    <strong
        ref={ref}
        style={{
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "0.25rem",
            ...style,
        }}
        className={`toast-title ${className}`}
        {...props}
    />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, style, ...props }, ref) => (
    <p
        ref={ref}
        style={{
            fontSize: "0.875rem",
            color: "#666666",
            ...style,
        }}
        className={`toast-description ${className}`}
        {...props}
    />
));
ToastDescription.displayName = "ToastDescription";

// Example Usage
const ToastExample = () => {
    const [visible, setVisible] = React.useState(true);

    return (
        <ToastProvider>
            <ToastViewport>
                {visible && (
                    <Toast variant="destructive">
                        <div>
                            <ToastTitle>Warning</ToastTitle>
                            <ToastDescription>Something went wrong!</ToastDescription>
                        </div>
                        <ToastClose onClick={() => setVisible(false)} />
                    </Toast>
                )}
            </ToastViewport>
        </ToastProvider>
    );
};

export {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
    ToastExample,
};
