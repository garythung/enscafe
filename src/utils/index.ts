import { isEmpty } from "lodash";
import { ethers } from "ethers";
import { NETWORKS } from "~/constants/networks";

const ETHERSCAN_PREFIXES = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
};

export const getEtherscanLink = (
  data: string,
  type: "transaction" | "token" | "address" | "block",
) => {
  const chainId: number = NETWORKS[process.env.NEXT_PUBLIC_NETWORK];
  const prefix: string = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
  }etherscan.io`;

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`;
    }
    case "token": {
      return `${prefix}/token/${data}`;
    }
    case "block": {
      return `${prefix}/block/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
};

// Doesn't round
function truncateNum(num, decimals) {
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (decimals || -1) + "})?");
  return num.toString().match(re)[0];
}

// Can take string or float
// Returns float
//
// If passed decimals, will truncate to that amount of decimals
export const truncateEth = (eth, decimals = undefined) => {
  if (typeof eth === "string") {
    eth = parseFloat(eth);
  }

  if (eth === 0) {
    return 0;
  }

  if (decimals) {
    return truncateNum(eth, decimals);
  }

  if (eth < 100) {
    return truncateNum(eth, 3);
  }

  return truncateNum(eth, 2);
};

// Expects big numbers or string, returns string
export const getPercentage = (numer, denom) => {
  if (!ethers.BigNumber.isBigNumber(numer)) {
    numer = ethers.utils.parseEther(numer);
  }

  if (!ethers.BigNumber.isBigNumber(denom)) {
    denom = ethers.utils.parseEther(denom);
  }

  if (numer.isZero() && denom.isZero()) {
    return 0;
  }

  const percentage = ethers.utils.formatUnits(numer.mul(10000).div(denom), 2);

  return percentage;
};

// Expects big numbers or st
// Valid meaning NOT EMPTY and <= 18 decimals AND not NaN
export const isValidNum = (num) => {
  if (isEmpty(num)) {
    return false;
  }

  const regex = /\d+\.(\d+)/;
  const match = num.match(regex);
  if (match && match[1].length > 18) {
    return false;
  }

  return !isNaN(num);
};
