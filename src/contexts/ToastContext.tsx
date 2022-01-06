import React, { useState, useContext, useCallback } from "react";
import ToastContainer from "~/components/ToastContainer";

const ToastContext = React.createContext(null);

let id = 1;

export type ToastVariant = "success" | "warning" | "danger";
export type ToastData = {
  id: number;
  content: string | React.ReactNode;
  variant: ToastVariant;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (content: string | React.ReactNode, variant: ToastVariant) => {
      setToasts((toasts) => [
        ...toasts,
        {
          id: id++,
          content,
          variant,
        },
      ]);
    },
    [setToasts],
  );

  const removeToast = useCallback(
    (id) => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    },
    [setToasts],
  );

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
      }}
    >
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const toastHelpers = useContext(ToastContext);
  return toastHelpers;
};

export { ToastContext, useToast };
