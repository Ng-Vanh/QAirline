"use client";

import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

const styles = {
    root: {
        height: "1rem", // h-4
        width: "1rem", // w-4
        flexShrink: 0, // shrink-0
        borderRadius: "0.125rem", // rounded-sm
        border: "1px solid #3b82f6", // border-primary
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // shadow
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background-color 0.2s, border-color 0.2s",
    },
    rootChecked: {
        backgroundColor: "#3b82f6", // bg-primary
        color: "#ffffff", // text-primary-foreground
    },
    rootDisabled: {
        cursor: "not-allowed",
        opacity: 0.5, // disabled:opacity-50
    },
    indicator: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "currentColor", // text-current
    },
    icon: {
        height: "1rem", // h-4
        width: "1rem", // w-4
    },
};

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
    const isChecked = props.checked; // Assuming `checked` is passed as a prop
    const isDisabled = props.disabled;

    return (
        <CheckboxPrimitive.Root
            ref={ref}
            style={{
                ...styles.root,
                ...(isChecked && styles.rootChecked),
                ...(isDisabled && styles.rootDisabled),
            }}
            {...props}
        >
            <CheckboxPrimitive.Indicator style={styles.indicator}>
                <Check style={styles.icon} />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
