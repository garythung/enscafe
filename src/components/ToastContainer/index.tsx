import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTransition } from "react-spring";

import Toast from "~/components/Toast";
import type { ToastData } from "~/contexts/ToastContext";

const ToastContainer = ({ toasts }) => {
  const [mount, setMount] = useState(false);
  const transitions = useTransition(toasts, {
    keys: (toast) => toast.id,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  useEffect(() => {
    // Will be execute once in client-side
    setMount(true);
    return () => setMount(false);
  }, []);

  return mount
    ? createPortal(
        <div className="z-50 absolute top-0 right-0 flex flex-col">
          {transitions((styles, item: ToastData) => (
            <Toast
              id={item.id}
              variant={item.variant}
              disappears={item.disappears}
              style={styles}
            >
              {item.content}
            </Toast>
          ))}
        </div>,
        document.body,
      )
    : null;
};

export default ToastContainer;
