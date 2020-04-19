import { useGameMode, useSelfId, useGameView, usePlayers } from "../hooks/game";
import Button from "./Button";

import useNetwork from "../hooks/network";
import produce from "immer";

const ClaimSpymaster = () => {
  const gameView = useGameView();
  const players = usePlayers();
  const network = useNetwork();
  const gameMode = useGameMode();
  const selfId = useSelfId();

  const hasSpymaster = (team) =>
    Object.values(players).findIndex((p) => p.spymaster && p.team === team) >
    -1;

  const onClick = () => {
    const newGame = produce(gameView.game, (draftGame) => {
      draftGame.players[selfId].spymaster = true;
    });
    network.updateGame(newGame);
  };

  if (!players[selfId] || hasSpymaster(players[selfId]?.team)) {
    return null;
  }

  const selfTeam = players[selfId].team;

  return (
    <div className="w-full flex flex-col p-2">
      <h2 className="h2 text-center pb-2">Claim spymaster 🕵️‍♂️</h2>

      {gameMode === "classic" ? (
        <div className="mx-auto text-sm">
          <Button color={selfTeam} onClick={() => onClick()}>
            Become spymaster
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ClaimSpymaster;
