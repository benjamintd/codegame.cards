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

  if (!selfPlayer) {
    return null;
  }

  return (
    <div className="w-full flex flex-col justify-center p-2 text-sm">
      {gameMode === "classic" ? (
        <>
          {!hasSpymaster(selfPlayer.team) && (
            <Button
              color={selfPlayer.team === "red" ? "dark-red" : "dark-blue"}
              onClick={() => onClick({ spymaster: true })}
            >
              Become spymaster
            </Button>
          )}

          {!selfPlayer.spymaster && (
            <div
              onClick={() =>
                onClick({
                  team: selfPlayer.team === "red" ? "blue" : "red",
                })
              }
              className={classnames(
                "text-center ml-2 underline cursor-pointer",
                {
                  "text-blue-800 hover:text-blue-700":
                    selfPlayer.team === "red",
                  "text-red-800 hover:text-red-700": selfPlayer.team === "blue",
                }
              )}
            >
              switch teams
            </div>
          )}
          <p className="text-center pt-4">
            Click on a card or give a hint to start the game! The{" "}
            {maxScores.red > maxScores.blue ? "red" : "blue"} team plays first.{" "}
            <button
              className="underline hover:text-gray-700"
              onClick={() => setShowModal(true)}
            >
              See rules
            </button>
          </p>
        </>
      ) : (
        // duet game
        <>
          <p className="text-center pt-4">
            Click on a card or give a hint to start the game!{" "}
            <button
              className="underline hover:text-gray-700"
              onClick={() => setShowModal(true)}
            >
              See rules
            </button>
          </p>
        </>
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
