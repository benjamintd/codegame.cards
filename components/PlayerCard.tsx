import React from "react";
import { IPlayer } from "../lib/game";
import classnames from "classnames";

export default ({ player }: { player: IPlayer }) => {
  return (
    <div className="pr-2 inline-block md:block">
      <span
        className={classnames("font-bold", {
          "text-red-500": player.team === "red" && !player.spymaster,
          "text-red-700": player.team === "red" && player.spymaster,
          "text-blue-500": player.team === "blue" && !player.spymaster,
          "text-blue-700": player.team === "blue" && player.spymaster,
        })}
      >
        {player.name} {player.spymaster && "🕵️‍♂️"}
      </span>
    </div>
  );
};
