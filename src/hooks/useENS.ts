import { ENS_METADATA_URLS } from "~/constants/ens";
import { useNetwork } from "wagmi";

export const useENS = () => {
  const { activeChain } = useNetwork();

  if (!activeChain) {
    return { metadataUrl: ENS_METADATA_URLS["Ethereum"] };
  }

  return {
    metadataUrl: ENS_METADATA_URLS[activeChain.name],
  };
};
