import React, { useState, useContext, useCallback } from "react";
import ToastContainer from "~/components/ToastContainer";
import { getEtherscanLink } from "~/utils";

type ToastContextType = {
  addToast: ({ content, variant, disappears }: ToastInputData) => void;
  removeToast: (id: string) => void;
  addTxMiningToast: (txHash: String) => void;
};

export type ToastVariant = "success" | "warning" | "danger";
export type ToastInputData = {
  content: string | React.ReactNode;
  variant: ToastVariant;
  disappears?: boolean;
};
export type ToastData = ToastInputData & {
  id: number;
};

const ToastContext = React.createContext<ToastContextType>(null);

let id = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    ({ content, variant, disappears = false }: ToastInputData) => {
      setToasts((toasts) => [
        ...toasts,
        {
          id: id++,
          content,
          variant,
          disappears,
        },
      ]);
    },
    [setToasts],
  );

  const addTxMiningToast = useCallback(
    (hash: string) => {
      setToasts((toasts) => [
        ...toasts,
        {
          id: id++,
          content: (
            <div className="flex flex-col">
              <span>transaction sent</span>
              <a
                className="text-primary-blue font-medium text-sm"
                target="_blank"
                rel="noopener noreferrer"
                href={getEtherscanLink(hash, "transaction")}
              >
                view tx here
              </a>
            </div>
          ),
          variant: "success",
          disappears: false,
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
        addTxMiningToast,
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
