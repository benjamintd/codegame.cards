import React from "react";
import { IPlayer } from "../lib/game";
import classnames from "classnames";

export default React.memo(
  ({ player, isPresent }: { player: IPlayer; isPresent: boolean }) => {
    return (
      <div className="pr-2 inline-block md:block">
        <span
          className={classnames(
            "font-bold",
            isPresent && {
              "text-red-500": player.team === "red" && !player.spymaster,
              "text-red-700": player.team === "red" && player.spymaster,
              "text-blue-500": player.team === "blue" && !player.spymaster,
              "text-blue-700": player.team === "blue" && player.spymaster,
            },
            !isPresent && "text-gray-600"
          )}
        >
          {player.name}
          {!isPresent && " 😴"}
          {player.spymaster && " 🕵️‍♂️"}
        </span>
      </div>
    );
  }
);
