import React from "react";
import { useGameMode, useDuetTurns, useTurns, usePlayers } from "../hooks/game";
import { useTranslation, Trans } from "react-i18next";
import { groupBy } from "lodash";



const DuetScore = () => {
  const players = usePlayers();
  const teams = groupBy(Object.values(players), (p) => p.team);
  const spectators = teams["spectator"]
  const gameMode = useGameMode();
  const duetScore = useDuetTurns();
  const turns = useTurns();
  const { t } = useTranslation();
  const count = 9 - duetScore;

  if (gameMode !== "duet" || turns.length === 0) {
    return null;
  }

  return (
    <div className="text-center lg:p-2 p-1">
      {spectators && spectators.length && (
          spectators.map((s) => (
            <span key={s.id}>{s.name}</span>
          ))
        )}
      <Trans i18nKey="turns-left" count={count}>
        {{ count }} turns left ⏱
      </Trans>
    </div>
  );
};

export default DuetScore;
