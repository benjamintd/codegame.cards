import React from "react";
import { useBoardView } from "../hooks/game";
import { ICardView, ClassicGridItem } from "../lib/game";
import classnames from "classnames";

export default () => {
  const boardView = useBoardView();
  return (
    <div className="grid grid-cols-5 md:gap-2 gap-1 max-w-4xl mx-auto">
      {boardView.map((w: ICardView, i: number) => {
        return (
          <div
            className={classnames(
              "border font-bold rounded w-full h-12 flex items-center justify-center",
              {
                "border-gray-600 hover:bg-gray-100 cursor-pointer": !w.revealed,
                "border-red-800 bg-red-700 text-red-100":
                  w.revealed && w.color === ClassicGridItem.Red,
                "border-blue-800 bg-blue-700 text-blue-100":
                  w.revealed && w.color === ClassicGridItem.Blue,
                "border-orange-300 bg-orange-100 text-orange-900":
                  w.revealed && w.color === ClassicGridItem.Neutral,
                "border-black bg-gray-900 text-gray-100":
                  w.revealed && w.color === ClassicGridItem.Black,
              }
            )}
            key={i}
          >
            {w.word}
          </div>
        );
      })}
    </div>
  );
};
