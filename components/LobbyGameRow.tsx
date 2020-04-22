import React from "react";
import { IGame, ILanguage } from "../lib/game";
import Link from "next/link";

export default React.memo(({ game }: { game: IGame }) => {
  const players = Object.values(game.players || {});

  if (players.length === 0) {
    return null;
  }

  return (
    <Link href="/[gameId]" as={`/${game.id}`}>
      <div className="border-b-4 border-gray-300 border border-gray-600 rounded p-2 cursor-pointer w-84 hover:bg-white hover:shadow-md">
        <div className="flex mb-2 text-sm">
          <span className="tracking-wide font-mono">{game.id}</span>

          {Object.values(game.turns || []).length > 0 && (
            <span className="ml-auto text-green-500">started</span>
          )}
        </div>
        {game.players && (
          <div className="mb-2">
            👤
            {players.map((p) => p.name).join(", ")}
          </div>
        )}
        <div className="inline-block rounded-full border border-gray-600 text-gray-600 px-2">
          {game.options.mode}{" "}
          <span className="inline-block text-lg align-middle">
            {getFlag(game.options.language)}
          </span>
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
    default:
      // why not.
      return "🇺🇸";
  }
};
