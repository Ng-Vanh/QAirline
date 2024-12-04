"use client";

import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ variant = "default", size = "default", className = "", ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={`tabs-list ${variant} ${size} ${className}`} // Combine class names
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ variant = "default", size = "default", className = "", ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={`tabs-trigger ${variant} ${size} ${className}`} // Combine class names
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className = "", ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={`tabs-content ${className}`} // Combine class names
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
