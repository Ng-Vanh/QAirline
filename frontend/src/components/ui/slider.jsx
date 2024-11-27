"use client";

import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const styles = {
    root: {
        position: "relative",
        display: "flex",
        width: "100%", // w-full
        alignItems: "center",
        touchAction: "none", // touch-none
        userSelect: "none", // select-none
    },
    track: {
        position: "relative",
        height: "0.375rem", // h-1.5
        width: "100%", // w-full
        flexGrow: 1, // grow
        borderRadius: "9999px", // rounded-full
        backgroundColor: "rgba(59, 130, 246, 0.2)", // bg-primary/20
        overflow: "hidden",
    },
    range: {
        position: "absolute",
        height: "100%", // h-full
        backgroundColor: "#3b82f6", // bg-primary
    },
    thumb: {
        position: "absolute",
        height: "1rem", // h-4
        width: "1rem", // w-4
        borderRadius: "9999px", // rounded-full
        border: "1px solid rgba(59, 130, 246, 0.5)", // border-primary/50
        backgroundColor: "#ffffff", // bg-background
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // shadow
        transition: "background-color 0.2s ease, border-color 0.2s ease",
        cursor: "pointer",
    },
    thumbFocus: {
        outline: "none", // focus-visible:outline-none
        boxShadow: "0px 0px 0px 2px rgba(59, 130, 246, 0.5)", // focus-visible:ring-1 focus-visible:ring-ring
    },
    thumbDisabled: {
        pointerEvents: "none", // disabled:pointer-events-none
        opacity: 0.5, // disabled:opacity-50
    },
};

const Slider = React.forwardRef(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        style={styles.root}
        {...props}
    >
        <SliderPrimitive.Track style={styles.track}>
            <SliderPrimitive.Range style={styles.range} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            style={styles.thumb}
            onFocus={(e) => (e.target.style.boxShadow = styles.thumbFocus.boxShadow)}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
