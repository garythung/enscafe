import { useEffect } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";

import Web3ReactManager from "~/components/Web3ReactManager";
import { ToastProvider } from "~/contexts/ToastContext";

import "~/styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import WindowHelpers from "~/components/WindowHelpers";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App({ Component, pageProps }: AppPropsWithLayout) {
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

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>ens cafe</title>
        <meta name="description" content="the ENS community marketplace"></meta>

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://www.ens.cafe" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ens cafe" />
        <meta
          property="og:description"
          content="the ENS community marketplace"
        />

        {/* TODO: a 1200x630 image here */}
        <meta property="og:image" content="" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content="ens.cafe" />
        <meta name="twitter:url" content="https://www.ens.cafe" />
        <meta name="twitter:title" content="ens cafe" />
        <meta name="twitter:site" content="@ens_cafe" />
        <meta name="twitter:creator" content="@ens_cafe" />
        <meta
          name="twitter:description"
          content="the ENS community marketplace"
        />
        {/* TODO: a 1200x630 image here */}
        <meta name="twitter:image" content="" />
        {/* TODO: a 1200x630 image here */}
        <meta name="twitter:image:src" content="" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactManager>
          <ToastProvider>
            <WindowHelpers />
            {getLayout(<Component {...pageProps} />)}
            {/* <div className="max-w-screen-xl mx-auto"> */}
            {/* <Component {...pageProps} /> */}
            {/* </div> */}
          </ToastProvider>
        </Web3ReactManager>
      </Web3ReactProvider>
    </>
  );
}

export default App;
