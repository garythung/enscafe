import { InjectedConnector } from "@web3-react/injected-connector";

import { NETWORKS } from "~/constants/networks";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [NETWORKS[process.env.NEXT_PUBLIC_NETWORK]],
});
