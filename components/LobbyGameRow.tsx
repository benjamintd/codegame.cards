import React from "react";
import { IGame, ILanguage } from "../lib/game";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default React.memo(({ game }: { game: IGame }) => {
  const { t } = useTranslation();
  return (
    <Link href="/[gameId]" as={`/${game.id}`}>
      <div className="border-b-4 border-gray-300 border border-gray-600 rounded p-2 cursor-pointer w-84 hover:bg-white hover:shadow-md">
        <span className="tracking-wide font-mono mb-2 text-sm">{game.id}</span>
        {game.players && (
          <div className="mb-2">
            👤
            {Object.values(game.players)
              .map((p) => p.name)
              .join(", ")}
          </div>
        )}
        <div className="flex">
          <div className="inline-block rounded-full border border-gray-600 text-gray-800 px-2">
            {game.options.mode}{" "}
            <span className="inline-block text-lg align-middle">
              {getFlag(game.options.language)}
            </span>
          </div>
          {Object.values(game.turns || []).length > 0 && (
            <span className="ml-auto text-green-500">
              {t("game-started", "started")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

const getFlag = (language: ILanguage) => {
  switch (language) {
    case "en":
      return "🇬🇧";
    case "fr":
      return "🇫🇷";
    case "de":
      return "🇩🇪";
    case "es":
      return "🇪🇸";
    case "ru":
      return "🇷🇺";
    case "emoji":
      return "💎";
    default:
      // why not.
      return "🇺🇸";
  }
};
