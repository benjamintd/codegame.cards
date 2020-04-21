import React from "react";
import { groupBy } from "lodash";

import {
  usePlayers,
  useSelfPlayer,
  useScores,
  useMaxScores,
  useGameOver,
  useGameMode,
} from "../hooks/game";
import JoinGame from "./JoinGame";
import ClaimSpymasterOrSwitchTeam from "./ClaimSpymasterOrSwitchTeam";
import GameOver from "./GameOver";
import Team from "./Team";
import DuetScore from "./DuetScore";

export default () => {
  const players = usePlayers();
  const gameMode = useGameMode();
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
          {gameMode === "classic" && (
            <>
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
            </>
          )}

          {gameMode === "duet" && (
            <>
              <Team
                players={teams["duetA"]}
                team="duetA"
                score={scores["duet"]}
                maxScore={maxScores["duet"]}
              />
              <Team
                players={teams["duetB"]}
                team="duetB"
                score={scores["duet"]}
                maxScore={maxScores["duet"]}
              />
            </>
          )}
        </div>
      </div>
      {!selfPlayer && <JoinGame />}
      <ClaimSpymasterOrSwitchTeam />
      <DuetScore />
      {gameOver.over && <GameOver />}
    </div>
  );
};
