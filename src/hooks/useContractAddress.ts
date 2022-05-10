import { getAddress } from "ethers/lib/utils";
import { useNetwork } from "wagmi";
import { CONTRACTS } from "~/constants";
import type { Contract } from "~/constants/contracts";

export const useContractAddress = (contract: Contract): string => {
  const { activeChain } = useNetwork();

  // fallback is mainnet
  if (!activeChain) {
    return getAddress(CONTRACTS[contract]["Ethereum"]);
  }

  return getAddress(CONTRACTS[contract][activeChain.name]);
};
