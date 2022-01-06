import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { useEffect } from "react";

import { injectedConnector } from "~/utils/connectors";
// import { logEvent } from "~/lib/analytics";

/**
 * Use for network and injected - logs user in
 * and out after checking what network they're on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injectedConnector, undefined, true).catch((error) => {
            console.error("Failed to activate after accounts changed", error);
          });

          // logEvent({
          //   action: "connect",
          //   params: {
          //     address: accounts[0],
          //   },
          // });
        }
      };
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, activate, suppress]);
}
