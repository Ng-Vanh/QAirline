import React from "react";
import { useToast } from "../../hooks/use-toast";
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "../../components/ui/toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(({ id, title, description, action, ...props }) => (
                <Toast
                    key={id}
                    {...props}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        marginBottom: "10px",
                    }}
                >
                    <div style={{ display: "grid", gap: "4px" }}>
                        {title && (
                            <ToastTitle
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                }}
                            >
                                {title}
                            </ToastTitle>
                        )}
                        {description && (
                            <ToastDescription
                                style={{
                                    fontSize: "14px",
                                    color: "#555",
                                }}
                            >
                                {description}
                            </ToastDescription>
                        )}
                    </div>
                    {action}
                    <ToastClose
                        style={{
                            marginLeft: "auto",
                            padding: "4px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#999",
                        }}
                    >
                        ×
                    </ToastClose>
                </Toast>
            ))}
            <ToastViewport
                style={{
                    position: "fixed",
                    top: "16px",
                    right: "16px",
                    zIndex: 1000,
                }}
            />
        </ToastProvider>
    );
}
