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
import ClaimSpymaster from "./ClaimSpymaster";

export default () => {
  const players = usePlayers();
  const selfPlayer = useSelfPlayer();
  const scores = useScores();
  const maxScores = useMaxScores();

  const teams = groupBy(Object.values(players), (p) => p.team);

  return (
    <div className="border rounded bg-white shadow-md w-full h-full flex flex-col text-gray-800">
      <div className="w-full flex flex-col p-2">
        <h2 className="h2 text-center pb-2 sr-only md:not-sr-only">
          In the room
        </h2>
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
      {!selfPlayer && <JoinGame />}
      <ClaimSpymaster />
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
    <div className="pb-2">
      <div className="w-full py-1 border-t border-b flex justify-between mb-1">
        <h3 className="capitalize">{team} team</h3>
        <span className="text-sm font-light text-gray-600">
          found {score}/{maxScore}
        </span>
      </div>
      {players && players.length ? (
        players.map((p) => <PlayerCard key={p.id} player={p} />)
      ) : (
        <p className="text-gray-500 text-sm py-2">
          There are no players in this team yet!
        </p>
      )}
    </div>
  );
};
