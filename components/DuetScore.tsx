import React from "react";
import { useGameMode, useDuetTurns, useTurns } from "../hooks/game";
import { useTranslation } from "react-i18next";

export default () => {
  const gameMode = useGameMode();
  const duetScore = useDuetTurns();
  const turns = useTurns();
  const { t } = useTranslation();
  if (gameMode !== "duet" || turns.length === 0) {
    return null;
  }

  return (
    <div className="text-center p-2">
      {9 - duetScore} {t("turns-left", "turns left")} ⏱
    </div>
  );
};
