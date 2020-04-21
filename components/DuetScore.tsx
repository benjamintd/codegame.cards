import React from "react";
import { useGameMode, useDuetTurns, useTurns } from "../hooks/game";

export default () => {
  const gameMode = useGameMode();
  const duetScore = useDuetTurns();
  const turns = useTurns();
  if (gameMode !== "duet" || turns.length === 0) {
    return null;
  }

  return <div className="text-center p-2">{9 - duetScore} turns left ⏱</div>;
};
