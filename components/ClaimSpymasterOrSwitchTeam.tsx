import {
  useGameMode,
  useSelfId,
  useGameView,
  usePlayers,
  useSelfPlayer,
  useTurns,
  useMaxScores,
} from "../hooks/game";
import Button from "./Button";

import useNetwork from "../hooks/network";
import classnames from "classnames";
import produce from "immer";
import { IPlayer } from "../lib/game";
import { useState } from "react";
import RulesModal from "./RulesModal";

const ClaimSpymaster = () => {
  const gameView = useGameView();
  const players = usePlayers();
  const selfPlayer = useSelfPlayer();
  const turns = useTurns();
  const network = useNetwork();
  const gameMode = useGameMode();
  const selfId = useSelfId();
  const maxScores = useMaxScores();

  const [showModal, setShowModal] = useState<boolean>(false);

  const hasSpymaster = (team) =>
    Object.values(players).findIndex((p) => p.spymaster && p.team === team) >
    -1;

  const onClick = (playerUpdate: Partial<IPlayer>) => {
    const newGame = produce(gameView.game, (draftGame) => {
      draftGame.players[selfId] = { ...selfPlayer, ...playerUpdate };
    });
    network.updateGame(newGame);
  };

  const turnsWerePlayed =
    turns.filter((t) => t.type === "click" || t.type === "hint").length > 0;

  if (!selfPlayer) {
    return null;
  }

  if (turnsWerePlayed) {
    return null;
  }

  return (
    <div className="w-full flex flex-col p-2 text-sm">
      {gameMode === "classic" ? (
        <div className="mx-auto text-sm mt-2">
          {!hasSpymaster(selfPlayer.team) && (
            <Button
              color={selfPlayer.team === "red" ? "dark-red" : "dark-blue"}
              onClick={() => onClick({ spymaster: true })}
            >
              Become spymaster
            </Button>
          )}

          {!turnsWerePlayed && !selfPlayer.spymaster && (
            <span
              onClick={() =>
                onClick({
                  team: selfPlayer.team === "red" ? "blue" : "red",
                })
              }
              className={classnames("ml-2 underline cursor-pointer", {
                "text-blue-800 hover:text-blue-700": selfPlayer.team === "red",
                "text-red-800 hover:text-red-700": selfPlayer.team === "blue",
              })}
            >
              switch teams
            </span>
          )}
          <p className="pt-4">
            Click on a card or give a hint to start the game! The{" "}
            {maxScores.red > maxScores.blue ? "red" : "blue"} team plays first.{" "}
            <button
              className="underline hover:text-gray-700"
              onClick={() => setShowModal(true)}
            >
              See rules
            </button>
          </p>
        </div>
      ) : (
        // duet game
        <div className="mx-auto text-sm mt-2">
          {!turnsWerePlayed && (
            <p className="pt-4">
              Click on a card or give a hint to start the game!{" "}
              <button
                className="underline hover:text-gray-700"
                onClick={() => setShowModal(true)}
              >
                See rules
              </button>
            </p>
          )}
        </div>
      )}

      <RulesModal
        open={showModal}
        onClose={() => setShowModal(false)}
        mode={gameMode}
      />
    </div>
  );
};

export default ClaimSpymaster;
