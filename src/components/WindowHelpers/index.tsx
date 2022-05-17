import React, { useEffect } from "react";

import { useToast } from "~/contexts/ToastContext";

export default function WindowHelpers() {
  const toast = useToast();

  useEffect(() => {
    window.toast = toast;
  }, []);

  return <></>;
}
