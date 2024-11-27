"use client";

import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const styles = {
    root: {
        position: "relative",
        height: "0.5rem", // h-2
        width: "100%", // w-full
        overflow: "hidden",
        borderRadius: "9999px", // rounded-full
        backgroundColor: "rgba(59, 130, 246, 0.2)", // bg-primary/20
    },
    indicator: {
        height: "100%", // h-full
        width: "100%", // w-full
        flex: "1",
        backgroundColor: "#3b82f6", // bg-primary
        transition: "transform 0.3s ease", // transition-all
    },
};

const Progress = React.forwardRef(({ value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        style={styles.root}
        {...props}
    >
        <ProgressPrimitive.Indicator
            style={{
                ...styles.indicator,
                transform: `translateX(-${100 - (value || 0)}%)`,
            }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
