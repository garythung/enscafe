import { useEffect, useState } from "react";
import {
  apiProvider,
  configureChains,
  RainbowKitProvider,
  connectorsForWallets,
  wallet,
} from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiProvider } from "wagmi";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";

import { ToastProvider } from "~/contexts/ToastContext";

import "~/styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import "@rainbow-me/rainbowkit/styles.css";
import WindowHelpers from "~/components/WindowHelpers";
import { PROVIDERS } from "~/constants";
import { useRouter } from "next/router";

const SITE_TITLE = "ens cafe";
const SITE_DESCRIPTION = "the community marketplace for ENS names";
const SITE_ENDPOINT = "https://www.ens.cafe";
const SITE_DOMAIN = "ens.cafe";
const SITE_TWITTER = "@ens_cafe";
const SITE_BANNER = "/banner.png";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [
    apiProvider.jsonRpc((c) => ({
      rpcUrl: PROVIDERS[c.name],
    })),
    apiProvider.fallback(),
  ],
);

const needsInjectedWalletFallback =
  typeof window !== "undefined" &&
  window.ethereum &&
  !window.ethereum.isMetaMask &&
  !window.ethereum.isCoinbaseWallet;

const connectors = connectorsForWallets([
  {
    groupName: "Suggested",
    wallets: [
      wallet.coinbase({ chains, appName: SITE_TITLE }),
      wallet.walletConnect({ chains }),
      wallet.rainbow({ chains }),
      wallet.ledger({ chains }),
      wallet.metaMask({ chains }),
      wallet.argent({ chains }),
      ...(needsInjectedWalletFallback ? [wallet.injected({ chains })] : []),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [prevPath, setPrevPath] = useState(router.pathname);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("chainChanged", (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });
    }
  }, []);

  // track client-side page loads
  useEffect(() => {
    if (router.pathname !== prevPath) {
      window.analytics.page();
    }
    setPrevPath(router.pathname);
  }, [router.pathname]);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION}></meta>

        {/* Facebook Meta Tags */}
        <meta property="og:url" content={SITE_ENDPOINT} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />

        <meta property="og:image" content={SITE_BANNER} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={SITE_DOMAIN} />
        <meta name="twitter:url" content={SITE_ENDPOINT} />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:site" content={SITE_TWITTER} />
        <meta name="twitter:creator" content={SITE_TWITTER} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={SITE_BANNER} />
        <meta name="twitter:image:src" content={SITE_BANNER} />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ToastProvider>
            <WindowHelpers />
            {getLayout(<Component {...pageProps} />)}
            {/* <div className="max-w-screen-xl mx-auto"> */}
            {/* <Component {...pageProps} /> */}
            {/* </div> */}
          </ToastProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
