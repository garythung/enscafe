import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { useEffect } from "react";
import { ethers } from "ethers";

import { PROVIDERS } from "~/constants/providers";
import { injectedConnector } from "~/utils/connectors";

const fetcher =
  (library) =>
  (...args) => {
    const [account, method, ...params] = args;
    return library[method](account, ...params);
  };

const useWallet = () => {
  const { account, activate, active, deactivate, error, library } =
    useWeb3React();
  const { data: balance, mutate } = useSWR([account, "getBalance", "latest"], {
    fetcher: fetcher(library),
  });

  useEffect(() => {
    if (!library) {
      return;
    }

    // listen for changes on an Ethereum address and update balance
    library.on(account, (balance) => {
      mutate(balance, false);
    });

    // remove listener when the component is unmounted
    return () => {
      library.removeAllListeners(account);
    };
  }, []);

  return {
    account,
    deactivate,
    active,
    error,
    library,
    provider: new ethers.providers.JsonRpcProvider(
      PROVIDERS[process.env.NEXT_PUBLIC_NETWORK],
    ),
    activate: () => activate(injectedConnector),
    balance: balance ? ethers.utils.formatEther(balance) : "0", // string
  };
};

export default useWallet;
