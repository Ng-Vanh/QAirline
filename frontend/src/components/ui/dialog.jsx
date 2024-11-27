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
        animation: "fadeIn 0.2s",
    },
    content: {
        position: "fixed",
        left: "50%",
        top: "50%",
        zIndex: 50,
        display: "grid",
        width: "100%",
        maxWidth: "32rem",
        transform: "translate(-50%, -50%)",
        gap: "1rem",
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        padding: "1.5rem",
        boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.5rem",
    },
    closeButton: {
        position: "absolute",
        right: "1rem",
        top: "1rem",
        borderRadius: "0.25rem",
        opacity: 0.7,
        transition: "opacity 0.2s",
        cursor: "pointer",
    },
    closeButtonHover: {
        opacity: 1,
    },
    header: {
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        textAlign: "center",
    },
    footer: {
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "flex-end",
        gap: "0.5rem",
    },
    title: {
        fontSize: "1.125rem",
        fontWeight: "600",
        lineHeight: "1.5",
    },
    description: {
        fontSize: "0.875rem",
        color: "#6b7280", // Muted foreground
    },
};

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        style={styles.overlay}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            style={styles.content}
            {...props}
        >
            {children}
            <DialogPrimitive.Close
                style={styles.closeButton}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.opacity = styles.closeButtonHover.opacity)
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.opacity = styles.closeButton.opacity)
                }
            >
                <X />
                <span style={{ display: "none" }}>Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = (props) => (
    <div style={styles.header} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = (props) => (
    <div style={styles.footer} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef((props, ref) => (
    <DialogPrimitive.Title ref={ref} style={styles.title} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef((props, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        style={styles.description}
        {...props}
    />
));
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
