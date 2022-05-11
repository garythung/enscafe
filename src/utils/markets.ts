/**
 * Returns a static svg icon for the market.
 *
 * @param source
 */
export function getMarketIcon(source: "OpenSea" | "LooksRare" | "ens cafe") {
  const MARKET_TO_ICONS = {
    OpenSea: "/opensea.svg",
    LooksRare: "/looksrare.svg",
    "ens cafe": "/enscafe.svg",
  };
  return MARKET_TO_ICONS[source];
}
