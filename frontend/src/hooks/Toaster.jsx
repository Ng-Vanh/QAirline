import React from "react";
import Toast from "./Toast.jsx";
import { useToast } from "./toast";

function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div className="toast-viewport">
            {toasts.map(({ id, title, description, action, open, onOpenChange }) => (
                <Toast
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    action={action}
                    open={open}
                    onOpenChange={(open) => {
                        if (!open) dismiss(id);
                    }}
                />
            ))}
        </div>
    );
}

export default Toaster;
