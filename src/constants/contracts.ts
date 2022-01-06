export type Contracts =
  | "weth"
  | "ens"
  | "ensRegistrar"
  | "openseaProxyRegistry"
  | "openseaTokenTransferProxy";

// Localnet addresses match Mainnet, since mainnet forking will likely be used
export const CONTRACTS = {
  weth: {
    Localnet: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    Rinkeby: "0xc778417e063141139fce010982780140aa0cd5ab",
    Mainnet: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  ens: {
    Localnet: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    Rinkeby: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    Mainnet: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
  },
  openseaProxyRegistry: {
    Localnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
    Rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
    Mainnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
  },
  openseaTokenTransferProxy: {
    Localnet: "0xe5c783ee536cf5e63e792988335c4255169be4e1",
    Rinkeby: "0x82d102457854c985221249f86659c9d6cf12aa72",
    Mainnet: "0xe5c783ee536cf5e63e792988335c4255169be4e1",
  },
  ensRegistrar: {
    Localnet: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    Mainnet: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    Rinkeby: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  },
};
