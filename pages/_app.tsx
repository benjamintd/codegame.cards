import NextApp, { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { NetworkContext } from "../hooks/network";

export default class MyApp extends NextApp {
  render() {
    return <App {...this.props} />;
  }
}

function App(props: AppProps) {
  const { Component } = props;

  const network = new FirebaseNetwork(setupFirebase());

  return (
    <>
      <Head>{/* todo fill head and meta tags */}</Head>
      <NetworkContext.Provider value={network}>
        <Component />
      </NetworkContext.Provider>
    </>
  );
}
