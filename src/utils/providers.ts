import { ethers } from "ethers";
import { PROVIDERS } from "~/constants";

export const getJsonRpcProvider = () =>
  new ethers.providers.JsonRpcProvider(
    PROVIDERS[process.env.NEXT_PUBLIC_NETWORK],
  );
