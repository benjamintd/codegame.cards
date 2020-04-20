import React from "react";
import Head from "next/head";

export default () => {
  return (
    <Head>
      <title>Codenames</title>
      <meta
        name="description"
        content="Play Codenames online. Guess with friends in this real-time adaptation of the popular tabletop game."
      />
      <link rel="shortcut icon" href="/icon-192.png" />
      <meta property="og:title" content="codenames.cards" />
      <meta property="og:description" content="Play Codenames online." />
      <meta
        property="og:image"
        content="https://codenames.cards/og-image.png"
      />
      <meta property="og:url" content="https://codenames.cards" />
      <meta name="twitter:title" content="Codenames.cards" />
      <meta name="twitter:description" content="Play Codenames online." />
      <meta
        name="twitter:image"
        content="https://codenames.cards/og-image.png"
      />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <link
        href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap"
        rel="stylesheet"
      ></link>
    </Head>
  );
};
