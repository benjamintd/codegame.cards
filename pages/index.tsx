import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IGame, IGameMode, ILanguage } from "../lib/game";
import LobbyGameRow from "../components/LobbyGameRow";
import Button from "../components/Button";
import DiscordButton from "../components/DiscordButton";
import Rules from "../components/Rules";
import classnames from "classnames";
import { sortBy } from "lodash";
import { gameOverSelector } from "../lib/selectors";
import { GetStaticProps } from "next";
import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { useTranslation, Trans } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { i18n } from "../lib/i18n";
import Head from "next/head";

interface IProps {
  games: IGame[];
  locale: string;
}

const Home = ({ games, locale }: IProps) => {
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [rulesMode, setRulesMode] = useState<IGameMode>("classic");
  const { t } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(locale as ILanguage);
  }, []);

  return (
    <div className="flex flex-col items-center w-screen p-6 bg-gray-100 h-min-screen">
      <Head>
        <link rel="alternate" hrefLang="x-default" href="/" />
        {["en", "fr", "es", "ru", "ptbr"].map((locale) => (
          <link
            rel="alternate"
            hrefLang={locale}
            key={locale}
            href={`/${locale}`}
          />
        ))}
      </Head>
      <div className="absolute top-0 right-0 m-4">
        <LanguageSelector />
      </div>
      <h1 className="mt-6 font-mono h1">codegame.cards</h1>
      <p className="mb-4 font-mono">
        {t("tagline", "The popular card game, online. 🕵️‍♂️")}
      </p>
      <div className="flex">
        <Link href="/new-game">
          <a id="create-game">
            <Button>{t("create-game", "Create game")}</Button>
          </a>
        </Link>
      </div>

      <h2 className="mt-6 mb-4 h2">{t("join-room", "Join a room")}</h2>
      <div className="grid grid-flow-row grid-cols-1 gap-2 pb-6">
        {games.length === 0 && (
          <p className="text-gray-700">
            {t(
              "no-public-room",
              "There are currently no public games. Create one and invite friends!"
            )}
          </p>
        )}
        {games.map((g) => (
          <LobbyGameRow key={g.id} game={g} />
        ))}
      </div>
      <DiscordButton />
      <div className="w-full max-w-2xl p-6 mt-6 leading-relaxed text-gray-900 bg-white border rounded shadow ">
        <h2 id="how-to-play" className="mb-4 text-center h2">
          {t("how-to-play", "How to play")}
        </h2>
        <p>
          {t(
            "game-tagline",
            "Codegame is a game of guessing where teams compete to find words related to a hint-word given by another player."
          )}
        </p>
        <Image
          height={665}
          width={888}
          className="p-6"
          src="/illustration.svg"
          alt="Codegame illustration"
        />

        {!seeMore && (
          <p
            onClick={() => setSeeMore(true)}
            className="text-blue-800 underline cursor-pointer hover:text-blue-700"
          >
            {t("see-more", "See more...")}
          </p>
        )}
        {seeMore && (
          <div
            className={classnames({
              "sr-only": !seeMore,
              "not-sr-only": seeMore,
            })}
          >
            <div className="flex">
              {(["classic", "duet"] as IGameMode[]).map((mode) => (
                <button
                  key={mode}
                  className={classnames(
                    "rounded font-bold mr-2 hover:font-gray-700 p-2",
                    { "bg-gray-300": rulesMode === mode }
                  )}
                  onClick={() => setRulesMode(mode)}
                >
                  {t(mode + "-rules")}
                </button>
              ))}
            </div>
            <Rules mode={rulesMode} />
          </div>
        )}
      </div>
      <div className="max-w-4xl mt-6 text-gray-700">
        <p className="mb-2">
          {t(
            "support-authors",
            "This website is not affiliated with CGE which edits Codenames. If you like this game, please support the authors and buy a physical version!"
          )}
        </p>
        <p className="mb-2">
          {t("made-with-love", "Made with ♥ during the lockdown")}.{" "}
          <Trans i18nKey="its-open-source">
            It's
            <a
              className="underline hover:text-gray-600"
              href="https://github.com/benjamintd/codegame.cards"
            >
              open-source
            </a>
            .
          </Trans>
        </p>
        <p className="mb-2">
          <Trans i18nKey="check-our-privacy-policy">
            Check our{" "}
            <a className="underline hover:text-gray-600" href="/privacy-policy">
              privacy policy
            </a>
          </Trans>
        </p>
        <a className="py-2" href="https://www.buymeacoffee.com/benjamintd">
          <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=benjamintd&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" />
        </a>
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<IProps> = async ({ locale }) => {
  const firebase = new FirebaseNetwork(setupFirebase());
  let games = await firebase.getPublicGames();

  games = games.filter(
    (g) =>
      Object.values(g.players || {}).length > 0 &&
      g?.options?.private === "public" &&
      !gameOverSelector({ playerId: "", game: g }).over
  );

  games = sortBy(games, [
    (g) => (g?.turns || []).length, // sort unstarted games first
    (g) => -g.createdAt, // then more recent games first
  ]);

  return {
    props: {
      games,
      locale,
    },
    revalidate: 1,
  };
};
