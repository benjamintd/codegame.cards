import React from "react";
import Rules from "./Rules";
import { IGameMode } from "../lib/game";

interface IProps {
  onClose: () => void;
  mode: IGameMode;
  open: boolean;
}

export default ({ onClose, mode, open }: IProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed h-screen w-screen top-0 left-0 z-50 lg:p-6 p-4"
      style={{ backgroundColor: "rgba(74, 85, 104, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white h-full p-4 rounded shadow-lg overflow-y-scroll max-w-3xl mx-auto text-base"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={onClose}
          className="cursor-pointer ml-auto align-right rounded-full w-5 h-5 border text-gray-600 border-gray-600 hover:text-gray-700 hover:border-gray-700 flex items-center justify-center align-middle pb-1"
        >
          ×
        </div>
        <h1 className="h1">Rules</h1>
        <Rules mode={mode} />
      </div>
    </div>
  );
};
