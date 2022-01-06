import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { PROVIDERS } from "~/constants/providers";
import { Provider } from "ethcall";

const useMultiCall = () => {
  const [multiCall, setMultiCall] = useState();

  useEffect(() => {
    const func = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        PROVIDERS[process.env.NEXT_PUBLIC_NETWORK],
      );
      const ethcallProvider = new Provider();
      await ethcallProvider.init(provider);
      if (process.env.NEXT_PUBLIC_NETWORK === "Localnet") {
        ethcallProvider.multicallAddress =
          "0xeefba1e63905ef1d7acba5a8513c70307c1ce441"; // ONLY WHEN LOCAL
      }
      setMultiCall(ethcallProvider);
    };

    func();
  }, []);

  return {
    multiCall,
  };
};

export default useMultiCall;
