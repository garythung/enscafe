import React, { useEffect } from "react";

import { useToast } from "~/contexts/ToastContext";

export default function WindowHelpers() {
  const { addToast } = useToast();

  useEffect(() => {
    window.toast = {
      add: addToast,
    };
  }, []);

  return <></>;
}
