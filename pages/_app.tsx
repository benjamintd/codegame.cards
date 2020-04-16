import React from "react";

import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { NetworkContext } from "../hooks/network";

import "../css/main.css";

export default ({ Component, pageProps }) => {
  const network = new FirebaseNetwork(setupFirebase());

  return (
    <NetworkContext.Provider value={network}>
      <Component {...pageProps} />
    </NetworkContext.Provider>
  );
};
