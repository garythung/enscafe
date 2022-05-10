import { useState, useEffect } from "react";
import { Provider } from "ethcall";
import { useNetwork, useProvider } from "wagmi";

const useMultiCall = () => {
  const [multiCall, setMultiCall] = useState();
  const { activeChain } = useNetwork();
  const provider = useProvider();

  useEffect(() => {
    const func = async () => {
      if (!activeChain || !provider) {
        return;
      }

      const ethcallProvider = new Provider();
      await ethcallProvider.init(provider as any);
      if (activeChain.name === "Localhost") {
        // @ts-ignore
        ethcallProvider.multicallAddress =
          "0xeefba1e63905ef1d7acba5a8513c70307c1ce441"; // ONLY WHEN LOCAL
      }
      // @ts-ignore
      setMultiCall(ethcallProvider);
    };

    func();
  }, [activeChain, provider]);

  return {
    multiCall,
  };
};

export default useMultiCall;
