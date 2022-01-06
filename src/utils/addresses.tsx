import { getAddress } from "@ethersproject/address";

// Returns checksummed address or false if not valid
export const isAddress = (value: string) => {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
};

// Shortens an address to 0x[1234]...[1234]
export const shortenAddress = (address: string, chars: number = 4) => {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
};

// gets simplified address text for display, comparing with connected account
// Return flow:
// 1. empty -> ""
// 2. address is connected user -> "you"
// 3. address has ENS -> ENS name
// 4. "0xabcd...4321"
export const simplifyAddress = (
  address: string,
  connectedAccount: string,
  addressENSName: string | false,
): string | React.ReactNode => {
  if (!address) {
    return "";
  }

  if (isAddress(address) === connectedAccount) {
    return "you";
  }

  if (addressENSName) {
    return <span className="font-pressura">{addressENSName}</span>;
  }

  return shortenAddress(address);
};
