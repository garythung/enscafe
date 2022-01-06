import { useEffect } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import type { NextPage } from "next";
import type { AppProps } from "next/app";

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
  );
}

export default App;
