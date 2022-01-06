import { useEffect } from "react";
import useWallet from "~/hooks/useWallet";

const useBlockUpdate = (callback) => {
  const { library } = useWallet();

  useEffect(() => {
    if (!library) {
      return;
    }

    // listen for changes on an Ethereum address
    library.on("block", callback);

    // remove listener when the component is unmounted
    return () => {
      library.removeAllListeners("block");
    };
  }, [library]);
};

export default useBlockUpdate;
