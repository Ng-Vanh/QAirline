import React from "react";

const Button = React.forwardRef(
    (
        { children, variant = "default", size = "default", asChild = false, ...props },
        ref
    ) => {
        const Comp = asChild ? "span" : "button";

        const getVariantStyles = (variant) => {
            switch (variant) {
                case "default":
                    return {
                        backgroundColor: "#007bff",
                        color: "#fff",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        hover: {
                            backgroundColor: "#0056b3",
                        },
                    };
                case "destructive":
                    return {
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        hover: {
                            backgroundColor: "#c82333",
                        },
                    };
                case "outline":
                    return {
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        hover: {
                            backgroundColor: "#f8f9fa",
                        },
                    };
                case "secondary":
                    return {
                        backgroundColor: "#6c757d",
                        color: "#fff",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        hover: {
                            backgroundColor: "#5a6268",
                        },
                    };
                case "ghost":
                    return {
                        backgroundColor: "transparent",
                        color: "#000",
                        hover: {
                            backgroundColor: "#f8f9fa",
                        },
                    };
                case "link":
                    return {
                        backgroundColor: "transparent",
                        color: "#007bff",
                        textDecoration: "underline",
                        hover: {
                            textDecoration: "underline",
                        },
                    };
                default:
                    return {};
            }
        };

        const getSizeStyles = (size) => {
            switch (size) {
                case "sm":
                    return {
                        height: "32px",
                        padding: "4px 12px",
                        fontSize: "12px",
                    };
                case "lg":
                    return {
                        height: "48px",
                        padding: "8px 16px",
                        fontSize: "16px",
                    };
                case "icon":
                    return {
                        width: "36px",
                        height: "36px",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                    };
                default:
                    return {
                        height: "40px",
                        padding: "8px 16px",
                        fontSize: "14px",
                    };
            }
        };

        const styles = {
            ...getVariantStyles(variant),
            ...getSizeStyles(size),
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s",
        };

        return (
            <Comp
                {...props}
                ref={ref}
                style={{
                    ...styles,
                    ...(props.disabled && {
                        opacity: 0.5,
                        cursor: "not-allowed",
                    }),
                }}
                onMouseEnter={(e) => {
                    const hoverStyles = getVariantStyles(variant)?.hover;
                    if (hoverStyles) {
                        Object.keys(hoverStyles).forEach((key) => {
                            e.target.style[key] = hoverStyles[key];
                        });
                    }
                }}
                onMouseLeave={(e) => {
                    const baseStyles = getVariantStyles(variant);
                    if (baseStyles) {
                        Object.keys(baseStyles).forEach((key) => {
                            e.target.style[key] = baseStyles[key];
                        });
                    }
                }}
            >
                {children}
            </Comp>
        );
    }
);

export { Button };
