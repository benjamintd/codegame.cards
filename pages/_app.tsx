import React, { useEffect } from "react";
import Meta from "../components/Meta";
import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { NetworkContext } from "../hooks/network";
import { logPageView, initAnalytics, logEvent } from "../lib/analytics";
import Router from "next/router";
import App from "next/app";
import * as Sentry from "@sentry/browser";

import "../css/main.css";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

Router.events.on("routeChangeComplete", () => logPageView());

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  static reportWebVitals({ id, name, label, value }) {
    logEvent(`${label} metric`, name, {
      eventValue: Math.round(name === "CLS" ? value * 1000 : value),
      eventLabel: id,
      nonInteraction: true,
    });
  }

  componentDidMount() {
    initAnalytics();
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const network = new FirebaseNetwork(setupFirebase());
    const { Component, pageProps } = this.props;

    return (
      <NetworkContext.Provider value={network}>
        <Meta />
        <Component {...pageProps} />
      </NetworkContext.Provider>
    );
  }
}

export default MyApp;
