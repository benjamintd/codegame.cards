import React from "react";
import Meta from "../components/Meta";
import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { NetworkContext } from "../hooks/network";
import { logPageView, initAnalytics, logEvent } from "../lib/analytics";
import Router, { withRouter } from "next/router";
import App from "next/app";
import * as Sentry from "@sentry/browser";
import { I18nextProvider } from "react-i18next";
import { i18n } from "../lib/i18n";

import "../css/main.css";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

Router.events.on("routeChangeComplete", () => logPageView());

class MyApp extends App {
  public state = {
    i18nInitialized: false
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  static reportWebVitals({ id, name, label, value }) {
    logEvent(`${label} metric`, name, {
      value: Math.round(name === "CLS" ? value * 1000 : value),
      label: id,
      nonInteraction: true,
    });
  }

  componentDidMount() {
    initAnalytics();

    if (this.props.router.locale) {
      i18n.changeLanguage(this.props.router.locale);
    }

    i18n.on('initialized', () => this.setState({i18nInitialized: true}))
  }

  componentDidUpdate() {
    if (this.props.router.locale) {
      i18n.changeLanguage(this.props.router.locale);
    }
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
      <I18nextProvider i18n={i18n}>
        <NetworkContext.Provider value={network}>
          <Meta />
          <Component {...pageProps} />
        </NetworkContext.Provider>
      </I18nextProvider>
    );
  }
}

export default withRouter(MyApp);
