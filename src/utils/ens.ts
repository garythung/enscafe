import { BigNumber, utils } from "ethers";
import { namehash } from "@ethersproject/hash";

export const getTokenIdFromName = (name: string): string => {
  const labelHash = utils.keccak256(utils.toUtf8Bytes(name.toLowerCase()));
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
