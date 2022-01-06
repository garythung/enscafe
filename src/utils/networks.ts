import { NETWORKS } from "~/constants";

export const getChainId = () => NETWORKS[process.env.NEXT_PUBLIC_NETWORK];
