"use client";

import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

const styles = {
    base: {
        fontSize: "0.875rem", // text-sm
        fontWeight: "500", // font-medium
        lineHeight: "1.25", // leading-none
        cursor: "pointer",
        transition: "opacity 0.2s ease",
    },
    disabled: {
        cursor: "not-allowed", // peer-disabled:cursor-not-allowed
        opacity: 0.7, // peer-disabled:opacity-70
    },
};

const Label = React.forwardRef(({ className, ...props }, ref) => {
    const isDisabled = props.disabled;

    return (
        <LabelPrimitive.Root
            ref={ref}
            style={{
                ...styles.base,
                ...(isDisabled && styles.disabled),
            }}
            {...props}
        />
    );
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
