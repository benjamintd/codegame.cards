import React from "react";
import { groupBy } from "lodash";

import {
  usePlayers,
  useSelfPlayer,
  useScores,
  useMaxScores,
  useGameOver,
  useGameMode,
  usePlayersPresences,
  useTurns,
} from "../hooks/game";
import JoinGame from "./JoinGame";
import ClaimSpymasterOrSwitchTeam from "./ClaimSpymasterOrSwitchTeam";
import GameOver from "./GameOver";
import Team from "./Team";
import DuetScore from "./DuetScore";
import CopyLink from "./CopyLink";
import { useTranslation } from "react-i18next";

export default () => {
  const players = usePlayers();
  const gameMode = useGameMode();
  const selfPlayer = useSelfPlayer();
  const scores = useScores();
  const maxScores = useMaxScores();
  const gameOver = useGameOver();
  const presences = usePlayersPresences();
  const turns = useTurns();
  const { t } = useTranslation();

  const teams = groupBy(Object.values(players), (p) => p.team);

  const turnsWerePlayed =
    turns.filter((t) => t.type === "click" || t.type === "hint").length > 0;

  return (
    <div className="border rounded bg-gray-200 p-1 shadow-md w-full h-full flex flex-col text-gray-800 overflow-y-scroll">
      <div className="border rounded bg-white flex flex-col flex-grow">
        <div>
          <h2 className="uppercase font-bold text-sm text-center sr-only lg:not-sr-only leading-loose">
            {t("in-the-room", "In the room")}
          </h2>
          <div className="grid lg:grid-rows-2 lg:grid-cols-1 grid-cols-2 lg:gap-6 gap-2">
            {gameMode === "classic" && (
              <>
                <Team
                  players={teams["red"]}
                  team="red"
                  score={scores["red"]}
                  maxScore={maxScores["red"]}
                  presences={presences}
                />
                <Team
                  players={teams["blue"]}
                  team="blue"
                  score={scores["blue"]}
                  maxScore={maxScores["blue"]}
                  presences={presences}
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
                  presences={presences}
                />
                <Team
                  players={teams["duetB"]}
                  team="duetB"
                  score={scores["duet"]}
                  maxScore={maxScores["duet"]}
                  presences={presences}
                />
                {teams.spectator && (
                  <Team
                    players={teams["spectator"]}
                    team="spectator"
                    presences={presences}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <DuetScore />
        {!selfPlayer && <JoinGame />}
        {!turnsWerePlayed && <ClaimSpymasterOrSwitchTeam />}
        {!turnsWerePlayed && <CopyLink />}
        {gameOver.over && <GameOver />}
        <div className="mt-auto lg:block hidden leading-tight p-2">
          <a
            href="https://www.buymeacoffee.com/benjamintd"
            className="text-sm text-gray-600 hover:text-gray-400 underline mb-2"
          >
            {t("buymeacoffee", "Support the game by buying me a coffee!")}
          </a>
        </div>
      </div>
    </div>
  );
};
