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
          <link rel="icon" href="/favicon.png" />

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
