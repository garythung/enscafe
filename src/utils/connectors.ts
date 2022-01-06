import { InjectedConnector } from "@web3-react/injected-connector";

import { NETWORKS } from "~/constants/networks";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [NETWORKS.Mainnet, NETWORKS.Rinkeby],
});
