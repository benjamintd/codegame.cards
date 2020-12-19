import React from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const Meta = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Head>
      <title>{t("page-title", "Codegame - Play Online")}</title>
      <meta name="description" content={t("page-description")} />
      <link rel="shortcut icon" href="/icon-192.png" />
      <meta property="og:title" content="codegame.cards" />
      <meta property="og:description" content={t("page-description")} />
      <meta
        property="og:image"
        content="https://codegame.cards/og-image.png"
      />
      <meta property="og:url" content="https://codegame.cards" />
      <meta name="twitter:title" content="Codegame.cards" />
      <meta name="twitter:description" content={t("page-description")} />
      <meta
        name="twitter:image"
        content="https://codegame.cards/og-image.png"
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

export default Meta;
