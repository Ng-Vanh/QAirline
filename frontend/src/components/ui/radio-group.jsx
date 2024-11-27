"use client";

import React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

const styles = {
    root: {
        display: "grid",
        gap: "0.5rem", // gap-2
    },
    item: {
        aspectRatio: "1 / 1", // aspect-square
        height: "1rem", // h-4
        width: "1rem", // w-4
        borderRadius: "9999px", // rounded-full
        border: "1px solid #3b82f6", // border-primary
        color: "#3b82f6", // text-primary
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // shadow
        outline: "none", // focus:outline-none
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease", // focus-visible:ring
    },
    itemDisabled: {
        cursor: "not-allowed", // disabled:cursor-not-allowed
        opacity: 0.5, // disabled:opacity-50
    },
    indicator: {
        display: "flex", // flex
        alignItems: "center", // items-center
        justifyContent: "center", // justify-center
    },
    circle: {
        height: "0.875rem", // h-3.5
        width: "0.875rem", // w-3.5
        fill: "#3b82f6", // fill-primary
    },
};

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            style={styles.root}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef(({ className, disabled, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            style={{
                ...styles.item,
                ...(disabled && styles.itemDisabled),
            }}
            disabled={disabled}
            {...props}
        >
            <RadioGroupPrimitive.Indicator style={styles.indicator}>
                <Circle style={styles.circle} />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
