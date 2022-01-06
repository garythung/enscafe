import { utils } from "ethers";
import { useState, useEffect } from "react";
import { getJsonRpcProvider } from "~/utils/providers";

const lookupAddress = async (address: string): Promise<string> => {
  if (utils.isAddress(address)) {
    try {
      // Accuracy of reverse resolution is not enforced.
      // We then manually ensure that the reported ens name resolves to address
      const reportedName = await getJsonRpcProvider().lookupAddress(address);
      const resolvedAddress = await getJsonRpcProvider().resolveName(
        reportedName,
      );

      if (
        address &&
        utils.getAddress(address) === utils.getAddress(resolvedAddress)
      ) {
        return reportedName;
      } else {
        return utils.getAddress(address);
      }
    } catch (e) {
      return utils.getAddress(address);
    }
  }

  return "";
};

/**
 * Gets ENS name from given address and provider
 * @param address (string)
 * @returns (string) ens name or shortened address
 */
export default function useENSName(address: string): string {
  const [ens, setEns] = useState<string>("");

  // Update ens whenever full address changes
  useEffect(() => {
    setEns("");
    if (!address) {
      return;
    }

    const checksummedAddress = utils.getAddress(address);
    const storedData: any = window.localStorage.getItem(
      "ensCache_" + checksummedAddress,
    );
    const cache = JSON.parse(storedData ?? "{}") as Record<string, any>;

    // pull from cache
    if (cache && cache?.name && cache?.timestamp > Date.now()) {
      setEns(cache?.name);
    } else {
      // look up ens and cache it if it exists
      void lookupAddress(checksummedAddress).then((name) => {
        if (name && name !== checksummedAddress) {
          setEns(name);
          window.localStorage.setItem(
            "ensCache_" + checksummedAddress,
            JSON.stringify({
              timestamp: Date.now() + 360000,
              name,
            }),
          );
        }
      });
    }
  }, [address]);

  return ens;
}
