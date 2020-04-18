import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import useNetwork from "../hooks/network";
import { IGame, IGameView } from "../lib/game";
import useLocalStorage from "../hooks/useLocalStorage";
import PlayersList from "../components/PlayersList";
import GameBoard from "../components/GameBoard";
import Chat from "../components/Chat";
import { GameViewContext } from "../hooks/game";
import Loading from "../components/Loading";
import { AnimatePresence } from "framer-motion";

export default () => {
  const network = useNetwork();
  const router = useRouter();

  const [game, setGame] = useState<IGame>(null);
  const [player, setPlayer] = useLocalStorage("player", { id: uuidv4() });
  const [gameView, setGameView] = useState<IGameView>({
    game,
    playerId: player.id,
  });

  // subscribe to game updates
  useEffect(() => {
    network.subscribeToGame(router.query.gameId as string, (game) => {
      setGame(game);
    });
  }, [network]);

  // update the game view when the game or the player changes
  useEffect(() => {
    setGameView({ game, playerId: player.id });
  }, [game, player]);

  // update the player name in the local storage
  // when it changes in the game
  useEffect(() => {
    try {
      const p = game.players[player.id];
      if (p.name !== player.name) {
        setPlayer({ ...player, name });
      }
    } catch (error) {
      // we don't yet have a game, it's fine
    }
  }, [game]);

  return (
    <GameViewContext.Provider value={gameView}>
      <AnimatePresence>
        {!game && (
          <div className="absolute flex w-screen h-screen bg-gray-200">
            <Loading />
          </div>
        )}
      </AnimatePresence>
      <div className="flex w-screen h-screen">
        <div className="w-3/12 p-6">
          <PlayersList />
        </div>
        <div className="w-6/12 p-6">
          <GameBoard />
        </div>
        <div className="w-4/12 p-6">
          <Chat />
        </div>
      </div>
    </GameViewContext.Provider>
  );
};
