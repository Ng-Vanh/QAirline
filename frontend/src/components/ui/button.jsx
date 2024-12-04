import React from "react";

const Button = React.forwardRef(
    (
        { children, variant = "default", size = "default", asChild = false, className = "", ...props },
        ref
    ) => {
        const Comp = asChild ? "span" : "button";

        return (
            <Comp
                {...props}
                ref={ref}
                className={`btn ${variant} ${size} ${className}`} // Add custom and default classes
            >
                {children}
            </Comp>
        );
    }
);



export { Button };
