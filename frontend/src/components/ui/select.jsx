"use client";

import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const styles = {
    trigger: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "2.25rem", // h-9
        width: "100%", // w-full
        borderRadius: "0.375rem", // rounded-md
        border: "1px solid #d1d5db", // border-input
        backgroundColor: "transparent", // bg-transparent
        padding: "0.5rem 0.75rem", // px-3 py-2
        fontSize: "0.875rem", // text-sm
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
        outline: "none",
        cursor: "pointer",
    },
    icon: {
        height: "1rem", // h-4
        width: "1rem", // w-4
        opacity: 0.5,
    },
    content: {
        position: "absolute",
        zIndex: 50,
        maxHeight: "24rem", // max-h-96
        minWidth: "8rem", // min-w-[8rem]
        overflow: "hidden",
        borderRadius: "0.375rem", // rounded-md
        border: "1px solid #d1d5db", // border
        backgroundColor: "#ffffff", // bg-popover
        color: "#374151", // text-popover-foreground
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // shadow-md
        padding: "0.5rem", // p-1
    },
    item: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.375rem 0.5rem", // py-1.5 pl-2
        borderRadius: "0.375rem", // rounded-sm
        fontSize: "0.875rem", // text-sm
        cursor: "pointer",
        backgroundColor: "transparent",
        transition: "background-color 0.2s, color 0.2s",
    },
    itemIndicator: {
        position: "absolute",
        right: "0.5rem", // right-2
        height: "0.875rem", // h-3.5
        width: "0.875rem", // w-3.5
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    separator: {
        height: "1px", // h-px
        backgroundColor: "#e5e7eb", // bg-muted
        margin: "0.25rem 0", // my-1
    },
};

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        style={styles.trigger}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown style={styles.icon} />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(({ children, ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            style={styles.content}
            {...props}
        >
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef(({ children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        style={styles.item}
        {...props}
    >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <span style={styles.itemIndicator}>
            <SelectPrimitive.ItemIndicator>
                <Check style={styles.icon} />
            </SelectPrimitive.ItemIndicator>
        </span>
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = React.forwardRef(({ ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        style={{ padding: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}
        {...props}
    />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectSeparator = React.forwardRef(({ ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        style={styles.separator}
        {...props}
    />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
};
