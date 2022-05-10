import { useNetwork } from "wagmi";

const API_URLS = {
  Localhost: "https://api.reservoir.tools",
  Rinkeby: "https://api-rinkeby.reservoir.tools",
  Ethereum: "https://api.reservoir.tools",
};

export const useReservoir = () => {
  const { activeChain } = useNetwork();

  // fallback is mainnet
  if (!activeChain) {
    return {
      apiBase: API_URLS["Ethereum"],
    };
  }

  return {
    apiBase: API_URLS[activeChain.name],
  };
};
