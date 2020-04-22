import React from "react";
import { IGame, ILanguage } from "../lib/game";
import Link from "next/link";

export default ({ game }: { game: IGame }) => {
  return (
    <Link href="/[gameId]" as={`/${game.id}`}>
      <div className="border-b-4 border-gray-300 border border-gray-600 rounded p-2 cursor-pointer w-84 bg-white hover:shadow-md">
        <div className="text-sm mb-2 tracking-wide font-mono">{game.id}</div>
        <div className="flex">
          <div className="mr-2">
            {Object.keys(game.players || {}).length} players
          </div>
          <div className="mr-2">{game.options.mode}</div>
          <div>{getFlag(game.options.language)}</div>
        </div>
      </div>
    </Link>
  );
};

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
    default:
      // why not.
      return "🇺🇸";
  }
};
