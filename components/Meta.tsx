import React from "react";
import Head from "next/head";

export default () => {
  return (
    <Head>
      <title>Codenames - Play Online</title>
      <meta
        name="description"
        content="Play Codenames online, a multiplayer word game available on phone, tablet & desktop."
      />
      <link rel="shortcut icon" href="/icon-192.png" />
      <meta property="og:title" content="codenames.cards" />
      <meta
        property="og:description"
        content="Play Codenames online, a multiplayer word game available on phone, tablet & desktop."
      />
      <meta
        property="og:image"
        content="https://codenames.cards/og-image.png"
      />
      <meta property="og:url" content="https://codenames.cards" />
      <meta name="twitter:title" content="Codenames.cards" />
      <meta
        name="twitter:description"
        content="Play Codenames online, a multiplayer word game available on phone, tablet & desktop."
      />
      <meta
        name="twitter:image"
        content="https://codenames.cards/og-image.png"
      />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="theme-color" content="#f7fafc"></meta>
      <link
        href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap"
        rel="stylesheet"
      ></link>
      <link rel="apple-touch-icon" href="/icon-512.png"></link>
      <link rel="manifest" href="/manifest.webmanifest"></link>
    </Head>
  );
};
