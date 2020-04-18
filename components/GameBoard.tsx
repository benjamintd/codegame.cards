import React from "react";
import { useBoardView } from "../hooks/game";

export default () => {
  const boardView = useBoardView();
  return (
    <div className="grid grid-cols-5 gap-2 max-w-4xl mx-auto">
      {boardView.map((w, i) => {
        return (
          <div
            className="border hover:bg-white cursor-pointer rounded w-full h-12 flex items-center justify-center"
            key={i}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};
