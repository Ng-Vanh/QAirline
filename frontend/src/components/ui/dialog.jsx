"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        zIndex: 50,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        animation: "fadeIn 0.3s ease-in-out",
    },
    content: {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "90%",
        maxWidth: "36rem",
        padding: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "0.75rem",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
        border: "1px solid #e5e7eb",
    },
    closeButton: {
        position: "absolute",
        right: "1rem",
        top: "1rem",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        borderRadius: "0.375rem",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.2s",
    },
    closeButtonHover: {
        backgroundColor: "#f3f4f6",
    },
    header: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        textAlign: "center",
    },
    footer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "flex-end",
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: "700",
        lineHeight: "1.4",
        color: "#1f2937",
    },
    description: {
        fontSize: "1rem",
        color: "#6b7280",
        lineHeight: "1.6",
    },
};

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef(({ style, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        style={{ ...styles.overlay, ...style }}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ children, style, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            style={{ ...styles.content, ...style }}
            {...props}
        >
            {children}
            <DialogPrimitive.Close
                style={styles.closeButton}
                onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                    styles.closeButtonHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                <X />
                <span style={{ display: "none" }}>Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ style, ...props }) => (
    <div style={{ ...styles.header, ...style }} {...props} />
);

const DialogFooter = ({ style, ...props }) => (
    <div style={{ ...styles.footer, ...style }} {...props} />
);

const DialogTitle = React.forwardRef(({ style, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} style={{ ...styles.title, ...style }} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ style, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        style={{ ...styles.description, ...style }}
        {...props}
    />
));
const DialogClose = React.forwardRef(({ className = "", ...props }, ref) => (
    <DialogPrimitive.Close ref={ref} className={`dialog-close ${className}`} {...props} />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
