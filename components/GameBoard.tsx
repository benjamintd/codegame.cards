import React from "react";
import {
  useBoardView,
  usePushTurn,
  useSelfPlayer,
  useLastHint,
  useGameMode,
  usePresence,
} from "../hooks/game";
import { ICardView } from "../lib/game";
import Card from "./Card";

const GameBoard = () => {
  const selfPlayer = useSelfPlayer();
  const boardView = useBoardView();
  const pushTurn = usePushTurn();
  const lastHint = useLastHint();
  const mode = useGameMode();
  usePresence();

  return (
    <div className="w-full lg:my-auto">
      <div className="h-6 lg:mb-4 mb-2 text-center font-bold text-xl">
        {lastHint && lastHint.hint}
      </div>
      <div className="grid grid-cols-5 md:gap-2 gap-1 max-w-4xl mx-auto">
        {boardView.map((w: ICardView, i: number) => {
          return (
            <Card
              pushTurn={pushTurn}
              selfPlayer={selfPlayer}
              cardView={w}
              index={i}
              key={i}
              mode={mode}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
