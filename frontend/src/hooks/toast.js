import React, { useReducer, useEffect, useState } from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 10000;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
};

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
    if (toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
                ),
            };

        case actionTypes.DISMISS_TOAST:
            const { toastId } = action;

            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
            }

            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toast.id === toastId || toastId === undefined
                        ? { ...toast, open: false }
                        : toast
                ),
            };

        case actionTypes.REMOVE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
            };

        default:
            return state;
    }
};

const listeners = [];
let memoryState = { toasts: [] };

function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
}

function toast(props) {
    const id = genId();

    const update = (newProps) =>
        dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...newProps, id } });

    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss();
            },
        },
    });

    return { id, update, dismiss };
}

function useToast() {
    const [state, setState] = useState(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) listeners.splice(index, 1);
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    };
}

export { useToast, toast };