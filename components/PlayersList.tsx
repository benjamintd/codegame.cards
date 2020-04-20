import React from "react";
import {
  usePlayers,
  useSelfPlayer,
  useScores,
  useMaxScores,
} from "../hooks/game";
import JoinGame from "./JoinGame";
import PlayerCard from "./PlayerCard";
import { groupBy } from "lodash";
import { IPlayer } from "../lib/game";
import ClaimSpymasterOrSwitchTeam from "./ClaimSpymasterOrSwitchTeam";
import classnames from "classnames";

export default () => {
  const players = usePlayers();
  const selfPlayer = useSelfPlayer();
  const scores = useScores();
  const maxScores = useMaxScores();

  const teams = groupBy(Object.values(players), (p) => p.team);

  return (
    <div className="border rounded bg-white shadow-md w-full h-full flex flex-col text-gray-800">
      <div className="w-full flex flex-col">
        <h2 className="h2 text-center sr-only md:not-sr-only leading-loose">
          In the room
        </h2>
        <div className="grid lg:grid-rows-2 lg:grid-cols-1 grid-cols-2 lg:gap-6 gap-2">
          <Team
            players={teams["red"]}
            team="red"
            score={scores["red"]}
            maxScore={maxScores["red"]}
          />
          <Team
            players={teams["blue"]}
            team="blue"
            score={scores["blue"]}
            maxScore={maxScores["blue"]}
          />
        </div>
      </div>
      {!selfPlayer && <JoinGame />}
      <ClaimSpymasterOrSwitchTeam />
    </div>
  );
};

const Team = ({
  players,
  team,
  score,
  maxScore,
}: {
  players: IPlayer[] | undefined;
  team: "red" | "blue";
  score: number;
  maxScore: number;
}) => {
  return (
    <div className="pb-1">
      <div
        className={classnames(
          "w-full px-2 py-1 border-t border-b flex justify-between mb-1",
          { "bg-red-100": team === "red", "bg-blue-100": team === "blue" }
        )}
      >
        <h3 className="capitalize">{team} team</h3>
        <span
          className={classnames("text-sm font-bold text-gray-600", {
            "text-red-900": team === "red",
            "text-blue-900": team === "blue",
          })}
        >
          {score}/{maxScore} cards
        </span>
      </div>
      <div className="px-2 py-1">
        {players && players.length ? (
          players.map((p) => <PlayerCard key={p.id} player={p} />)
        ) : (
          <p className="text-gray-500 text-sm">
            There are no players in this team yet!
          </p>
        )}
      </div>
    </div>
  );
};
