import React from "react";
import { useGameMode, useDuetTurns, useTurns } from "../hooks/game";
import { useTranslation, Trans } from "react-i18next";

export default () => {
  const gameMode = useGameMode();
  const duetScore = useDuetTurns();
  const turns = useTurns();
  const { t } = useTranslation();
  const count = 9 - duetScore;

  if (gameMode !== "duet" || turns.length === 0) {
    return null;
  }

  return (
    <div className="text-center p-2">
      <Trans i18nKey="turns-left" count={count}>
        {{ count }} turns left ⏱
      </Trans>
    </div>
  );
};
