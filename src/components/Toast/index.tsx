import React, { useEffect } from "react";
import { animated } from "react-spring";
import { XIcon } from "@heroicons/react/outline";

import { useToast } from "~/contexts/ToastContext";
import type { ToastVariant } from "~/contexts/ToastContext";

const Toast = ({
  children,
  style,
  id,
  variant,
  disappears,
}: {
  children: React.ReactNode;
  style: any;
  id: number;
  variant: ToastVariant;
  disappears: boolean;
}) => {
  const { removeToast } = useToast();
  let boxShadow = "-4px 4px 0px 0px";
  if (variant === "success") {
    boxShadow += " #6EFF70";
  } else if (variant === "warning") {
    boxShadow += " #FFDD6E";
  } else if (variant === "danger") {
    boxShadow += " #FF8280";
  }

  useEffect(() => {
    if (!disappears) {
      return;
    }

    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <animated.div
      className="mr-8 mt-4 relative px-6 py-4 border-1 border-black bg-white ml-auto rounded-lg transition ease-in-out hover:scale-105 duration-150"
      style={{ boxShadow, ...style }}
    >
      <button
        className="absolute right-1.5 top-1.5"
        onClick={() => {
          removeToast(id);
        }}
      >
        <XIcon className="h-4 w-4 heroicon-sw-2" />
      </button>

      {children}
    </animated.div>
  );
};

export default Toast;
