"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const styles = {
    content: {
        zIndex: 50,
        overflow: "hidden",
        borderRadius: "0.375rem", // rounded-md
        backgroundColor: "#3b82f6", // bg-primary
        color: "#ffffff", // text-primary-foreground
        padding: "0.375rem 0.75rem", // px-3 py-1.5
        fontSize: "0.75rem", // text-xs
        animation: "fadeIn 0.2s ease, zoomIn 0.2s ease", // animate-in fade-in-0 zoom-in-95
        transition: "opacity 0.2s ease, transform 0.2s ease", // fade-out and zoom-out
    },
    fadeIn: {
        animation: "fadeIn 0.2s ease-in", // fade-in animation
    },
    fadeOut: {
        animation: "fadeOut 0.2s ease-out", // fade-out animation
    },
    slideInFromTop: {
        transform: "translateY(-0.5rem)", // slide-in-from-top
    },
    slideInFromBottom: {
        transform: "translateY(0.5rem)", // slide-in-from-bottom
    },
    slideInFromLeft: {
        transform: "translateX(-0.5rem)", // slide-in-from-left
    },
    slideInFromRight: {
        transform: "translateX(0.5rem)", // slide-in-from-right
    },
};

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(({ sideOffset = 4, side, ...props }, ref) => {
    const positionStyles =
        side === "bottom"
            ? styles.slideInFromTop
            : side === "top"
                ? styles.slideInFromBottom
                : side === "left"
                    ? styles.slideInFromRight
                    : styles.slideInFromLeft;

    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                style={{
                    ...styles.content,
                    ...positionStyles,
                }}
                {...props}
            />
        </TooltipPrimitive.Portal>
    );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
