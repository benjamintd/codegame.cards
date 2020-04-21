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
    >
      <div className="bg-white h-full p-4 rounded shadow-lg overflow-y-scroll">
        <div
          onClick={onClose}
          className="ml-auto align-right rounded-full w-5 h-5 text-gray-600 border border-gray-600 flex items-center justify-center align-middle pb-1"
        >
          ×
        </div>
        <Rules mode={mode} />
      </div>
    </div>
  );
};
