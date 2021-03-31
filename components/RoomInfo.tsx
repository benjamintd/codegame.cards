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

const RoomInfo = () => {
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
    <div className="flex flex-col w-full h-full p-1 overflow-y-scroll text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-md">
      <div className="flex flex-col flex-grow bg-white border rounded">
        <div>
          <h2 className="text-sm font-bold leading-loose text-center uppercase sr-only lg:not-sr-only">
            {t("in-the-room", "In the room")}
          </h2>
          <div className="grid grid-cols-2 gap-2 lg:grid-rows-2 lg:grid-cols-1 lg:gap-6">
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
                    className="hidden lg:block"
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
      </div>
    </div>
  );
};

export default RoomInfo;
