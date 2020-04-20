import { IPlayer } from "../lib/game";
import PlayerCard from "./PlayerCard";
import classnames from "classnames";

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

export default Team;
