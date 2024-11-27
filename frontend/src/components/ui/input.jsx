import React from "react";

const styles = {
    base: {
        display: "flex",
        height: "2.25rem", // h-9
        width: "100%", // w-full
        borderRadius: "0.375rem", // rounded-md
        border: "1px solid #d1d5db", // border-input
        backgroundColor: "transparent", // bg-transparent
        padding: "0.25rem 0.75rem", // px-3 py-1
        fontSize: "1rem", // text-base
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // shadow-sm
        transition: "background-color 0.2s, border-color 0.2s",
        outline: "none",
    },
    placeholder: {
        color: "#9ca3af", // placeholder:text-muted-foreground
    },
    focus: {
        borderColor: "#3b82f6", // focus:ring-ring
        boxShadow: "0px 0px 0px 2px rgba(59, 130, 246, 0.5)", // focus:ring-1
    },
    disabled: {
        cursor: "not-allowed",
        opacity: 0.5, // disabled:opacity-50
    },
    fileInput: {
        border: "none",
        backgroundColor: "transparent",
        fontSize: "0.875rem", // file:text-sm
        fontWeight: "500", // file:font-medium
        color: "#374151", // file:text-foreground
    },
};

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    const isFileInput = type === "file";

    return (
        <input
            type={type}
            ref={ref}
            style={{
                ...styles.base,
                ...(isFileInput && styles.fileInput),
                ...(props.disabled && styles.disabled),
            }}
            onFocus={(e) => (e.target.style = { ...styles.base, ...styles.focus })}
            onBlur={(e) => (e.target.style = styles.base)}
            {...props}
        />
    );
});

Input.displayName = "Input";

export { Input };
