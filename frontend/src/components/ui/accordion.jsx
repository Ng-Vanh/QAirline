import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const styles = {
    accordionItem: {
        borderBottom: "1px solid #ddd",
    },
    accordionTrigger: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        fontSize: "1rem",
        fontWeight: 500,
        textAlign: "left",
        cursor: "pointer",
        transition: "color 0.2s ease, transform 0.2s ease",
    },
    accordionTriggerHover: {
        textDecoration: "underline",
    },
    iconChevron: {
        transition: "transform 0.2s ease",
    },
    iconChevronOpen: {
        transform: "rotate(180deg)",
    },
    accordionContent: {
        overflow: "hidden",
        fontSize: "0.875rem",
        transition: "max-height 0.3s ease",
    },
    accordionContentInner: {
        padding: "1rem 0",
    },
};

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AccordionPrimitive.Item
            ref={ref}
            style={styles.accordionItem}
            {...props}
        />
    )
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(
    ({ children, ...props }, ref) => (
        <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
                ref={ref}
                style={styles.accordionTrigger}
                onMouseEnter={(e) =>
                    (e.target.style.textDecoration = styles.accordionTriggerHover.textDecoration)
                }
                onMouseLeave={(e) =>
                    (e.target.style.textDecoration = "none")
                }
                {...props}
            >
                {children}
                <ChevronDown
                    className="icon-chevron"
                    style={styles.iconChevron}
                    data-state={props["data-state"]}
                />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(
    ({ children, ...props }, ref) => (
        <AccordionPrimitive.Content
            ref={ref}
            style={styles.accordionContent}
            {...props}
        >
            <div style={styles.accordionContentInner}>{children}</div>
        </AccordionPrimitive.Content>
    )
);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
