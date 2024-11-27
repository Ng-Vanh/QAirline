import React from "react";

const styles = {
    base: {
        display: "flex",
        minHeight: "60px", // min-h-[60px]
        width: "100%", // w-full
        borderRadius: "0.375rem", // rounded-md
        border: "1px solid #d1d5db", // border-input
        backgroundColor: "transparent", // bg-transparent
        padding: "0.5rem 0.75rem", // px-3 py-2
        fontSize: "1rem", // text-base
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
        outline: "none", // focus-visible:outline-none
        resize: "vertical", // Enable resizing
        transition: "border-color 0.2s ease, box-shadow 0.2s ease", // focus-visible:ring
    },
    placeholder: {
        color: "#6b7280", // placeholder:text-muted-foreground
    },
    focus: {
        borderColor: "#3b82f6", // focus-visible:ring-ring
        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)", // focus-visible:ring-1
    },
    disabled: {
        cursor: "not-allowed", // disabled:cursor-not-allowed
        opacity: 0.5, // disabled:opacity-50
    },
};

const Textarea = React.forwardRef(({ className, disabled, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            style={{
                ...styles.base,
                ...(disabled && styles.disabled),
            }}
            onFocus={(e) => {
                e.target.style.borderColor = styles.focus.borderColor;
                e.target.style.boxShadow = styles.focus.boxShadow;
            }}
            onBlur={(e) => {
                e.target.style.borderColor = styles.base.border;
                e.target.style.boxShadow = "none";
            }}
            {...props}
        />
    );
});

Textarea.displayName = "Textarea";

export { Textarea };
