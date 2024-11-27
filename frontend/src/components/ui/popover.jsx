"use client";

import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

const styles = {
    content: {
        zIndex: 50,
        width: "18rem", // w-72
        borderRadius: "0.375rem", // rounded-md
        border: "1px solid #e5e7eb", // border
        backgroundColor: "#ffffff", // bg-popover
        color: "#374151", // text-popover-foreground
        padding: "1rem", // p-4
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // shadow-md
        outline: "none", // outline-none
        transition: "transform 0.2s ease, opacity 0.2s ease", // animations
        transformOrigin: "center",
    },
    openState: {
        opacity: 1, // fade-in
        transform: "scale(1)", // zoom-in
    },
    closedState: {
        opacity: 0, // fade-out
        transform: "scale(0.95)", // zoom-out
    },
    sideBottom: {
        transform: "translateY(-0.5rem)", // slide-in-from-top
    },
    sideTop: {
        transform: "translateY(0.5rem)", // slide-in-from-bottom
    },
    sideLeft: {
        transform: "translateX(0.5rem)", // slide-in-from-right
    },
    sideRight: {
        transform: "translateX(-0.5rem)", // slide-in-from-left
    },
};

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef(({ align = "center", sideOffset = 4, ...props }, ref) => {
    const [state, setState] = React.useState("closed");
    const side = props.side || "bottom"; // Default to bottom side

    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                ref={ref}
                align={align}
                sideOffset={sideOffset}
                onOpenAutoFocus={() => setState("open")}
                onCloseAutoFocus={() => setState("closed")}
                style={{
                    ...styles.content,
                    ...(state === "open" ? styles.openState : styles.closedState),
                    ...(side === "bottom" && styles.sideBottom),
                    ...(side === "top" && styles.sideTop),
                    ...(side === "left" && styles.sideLeft),
                    ...(side === "right" && styles.sideRight),
                }}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
