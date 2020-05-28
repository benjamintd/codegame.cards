import Document, { Head, Main, NextScript } from "next/document";
import * as Sentry from "@sentry/browser";

process.on("unhandledRejection", (err) => {
  Sentry.captureException(err);
});

process.on("uncaughtException", (err) => {
  Sentry.captureException(err);
});

export default class MyDocument extends Document {
  render() {
    const lang = this.props.__NEXT_DATA__?.props?.pageProps?.lang ?? "en";

    return (
      <html lang={lang}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
