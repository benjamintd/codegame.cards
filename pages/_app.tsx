import React, { useEffect } from "react";
import Meta from "../components/Meta";
import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { NetworkContext } from "../hooks/network";
import { initGA, logPageView } from "../lib/analytics";
import Router from "next/router";

import "../css/main.css";

Router.events.on("routeChangeComplete", () => logPageView());

export default ({ Component, pageProps }) => {
  useEffect(() => {
    initGA();
  }, []);

  const network = new FirebaseNetwork(setupFirebase());

  return (
    <NetworkContext.Provider value={network}>
      <Meta />
      <Component {...pageProps} />
    </NetworkContext.Provider>
  );
};
