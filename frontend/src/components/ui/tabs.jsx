"use client";

import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const styles = {
    list: {
        display: "inline-flex",
        height: "2.25rem", // h-9
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "0.5rem", // rounded-lg
        backgroundColor: "#f3f4f6", // bg-muted
        padding: "0.25rem", // p-1
        color: "#6b7280", // text-muted-foreground
    },
    trigger: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "0.375rem", // rounded-md
        padding: "0.25rem 0.75rem", // px-3 py-1
        fontSize: "0.875rem", // text-sm
        fontWeight: "500", // font-medium
        cursor: "pointer",
        transition: "all 0.2s ease", // transition-all
        outline: "none", // focus-visible:outline-none
        backgroundColor: "transparent", // Default background
        border: "none",
    },
    triggerActive: {
        backgroundColor: "#ffffff", // data-[state=active]:bg-background
        color: "#1f2937", // data-[state=active]:text-foreground
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // data-[state=active]:shadow
    },
    triggerDisabled: {
        pointerEvents: "none", // disabled:pointer-events-none
        opacity: 0.5, // disabled:opacity-50
    },
    content: {
        marginTop: "0.5rem", // mt-2
        outline: "none", // focus-visible:outline-none
        transition: "outline-color 0.2s ease", // focus-visible:ring
    },
};

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} style={styles.list} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        style={{
            ...styles.trigger,
            ...(props.disabled && styles.triggerDisabled),
            ...(props["data-state"] === "active" && styles.triggerActive),
        }}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content ref={ref} style={styles.content} {...props} />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
