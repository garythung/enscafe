import { BigNumber, utils } from "ethers";
import { namehash } from "@ethersproject/hash";
import { normalize } from "@ensdomains/eth-ens-namehash";

import { ENS_METADATA_ENDPOINTS } from "~/constants/ens";

export const getTokenIdFromName = (name: string): string => {
  const labelHash = utils.keccak256(utils.toUtf8Bytes(normalize(name)));
  return BigNumber.from(labelHash).toString();
};

export function safeNamehash(name?: string): string | undefined {
  if (name === undefined) return undefined;

  try {
    return namehash(name);
  } catch (error) {
    console.debug(error);
    return undefined;
  }
}

export const getENSMetadataUrl = () =>
  ENS_METADATA_URLS[process.env.NEXT_PUBLIC_NETWORK];
