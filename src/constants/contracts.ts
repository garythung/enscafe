export type Contract =
  | "weth"
  | "ens"
  | "ensRegistrar"
  | "wyvernProxyRegistry"
  | "wyvernTokenTransferProxy";

// Localhost addresses match mainnet, since mainnet forking will likely be used
export const CONTRACTS = {
  weth: {
    Localhost: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    Rinkeby: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    Ethereum: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  ens: {
    Localhost: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    Rinkeby: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    Ethereum: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
  },
  wyvernProxyRegistry: {
    Localhost: "0xa5409ec958C83C3f309868babACA7c86DCB077c1",
    Rinkeby: "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A",
    Ethereum: "0xa5409ec958C83C3f309868babACA7c86DCB077c1",
  },
  wyvernTokenTransferProxy: {
    Localhost: "0xE5c783EE536cf5E63E792988335c4255169be4E1",
    Rinkeby: "0xCdC9188485316BF6FA416d02B4F680227c50b89e",
    Ethereum: "0xE5c783EE536cf5E63E792988335c4255169be4E1",
  },
  ensRegistrar: {
    Localhost: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    Rinkeby: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    Ethereum: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  },
};
