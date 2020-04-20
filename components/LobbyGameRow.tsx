import React from "react";
import { IGame } from "../lib/game";
import Link from "next/link";

export default ({ game }: { game: IGame }) => {
  return (
    <Link href="/[gameId]" as={`/${game.id}`}>
      <div className="border-b-4 border-gray-300 border border-gray-600 rounded p-2 cursor-pointer w-84 bg-white hover:shadow-md">
        <div className="text-sm mb-2 tracking-wide font-bold">{game.id}</div>
        <div className="flex">
          <div className="mr-2">
            {Object.keys(game.players || {}).length} players
          </div>
          <div className="mr-2">{game.options.mode}</div>
          <div>{game.options.language === "en" ? "🇬🇧" : "🇫🇷"}</div>
        </div>
      </div>
    </Link>
  );
};
