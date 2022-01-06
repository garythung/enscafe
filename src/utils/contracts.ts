import { CONTRACTS } from "~/constants";
import type { Contracts } from "~/constants/contracts";

export const getContract = (contract: Contracts) =>
  CONTRACTS[contract][process.env.NEXT_PUBLIC_NETWORK];
