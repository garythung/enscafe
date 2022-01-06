import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <title>ens cafe</title>
          <meta
            name="description"
            content="the ENS community marketplace"
          ></meta>

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
          <link rel="icon" href="/favicon.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* fonts */}
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/GT-Pressura-Mono-Regular.woff"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/GT-Pressura-Mono-Bold.woff"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
          />
          <noscript>
            <link
              href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
              rel="stylesheet"
            />
          </noscript>
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
          />
          <noscript>
            <link
              href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
              rel="stylesheet"
            />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
