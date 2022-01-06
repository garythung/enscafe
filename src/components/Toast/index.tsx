import React, { useEffect } from "react";
import { animated } from "react-spring";

import { useToast } from "~/contexts/ToastContext";
import type { ToastVariant } from "~/contexts/ToastContext";

const Toast = ({
  children,
  id,
  variant,
  style,
}: {
  children: React.ReactNode;
  id: number;
  variant: ToastVariant;
  style: any;
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
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <animated.div
      className="mr-4 mt-8 relative px-3 py-2 border-1 border-black bg-white cursor-pointer"
      onClick={() => removeToast(id)}
      style={{ boxShadow, ...style }}
    >
      {children}
    </animated.div>
  );
};

export default Toast;
