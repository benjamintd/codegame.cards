import React from "react";
import {
  usePlayers,
  useSelfPlayer,
  useScores,
  useMaxScores,
  useGameOver,
} from "../hooks/game";
import JoinGame from "./JoinGame";
import PlayerCard from "./PlayerCard";
import { groupBy } from "lodash";
import { IPlayer } from "../lib/game";
import ClaimSpymasterOrSwitchTeam from "./ClaimSpymasterOrSwitchTeam";
import classnames from "classnames";
import Button from "./Button";
import Link from "next/link";

export default () => {
  const players = usePlayers();
  const selfPlayer = useSelfPlayer();
  const scores = useScores();
  const maxScores = useMaxScores();
  const gameOver = useGameOver();

  const teams = groupBy(Object.values(players), (p) => p.team);

  return (
    <div className="border rounded bg-white shadow-md w-full h-full flex flex-col text-gray-800">
      <div className="w-full flex flex-col">
        <h2 className="h2 text-center sr-only lg:not-sr-only leading-loose">
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
      {gameOver.over && (
        <div className="py-6 px-2 text-center">
          <p className="h2 pb-2">
            The game is over. <br />
            The {gameOver.winner} team wins!
          </p>
          <Link href="/">
            <a>
              <Button>Back to the lobby</Button>
            </a>
          </Link>
        </div>
      )}
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
          { "bg-red-100": team === "red", "bg-blue-100": team === "blue" },
          {
            "text-red-900": team === "red",
            "text-blue-900": team === "blue",
          }
        )}
      >
        <h3 className="capitalize font-mono font-bold">{team}</h3>
        <span className="text-sm font-bold">
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
