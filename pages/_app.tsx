import React from "react";
import Meta from "../components/Meta";
import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { NetworkContext } from "../hooks/network";

import "../css/main.css";

export default ({ Component, pageProps }) => {
  const network = new FirebaseNetwork(setupFirebase());

  return (
    <NetworkContext.Provider value={network}>
      <Meta />
      <Component {...pageProps} />
    </NetworkContext.Provider>
  );
};
