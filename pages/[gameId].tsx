import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import useNetwork from "../hooks/network";
import { IGame, IGameView, ILanguage } from "../lib/game";
import useLocalStorage from "../hooks/useLocalStorage";
import RoomInfo from "../components/RoomInfo";
import GameBoard from "../components/GameBoard";
import Chat from "../components/Chat";
import { GameViewContext } from "../hooks/game";
import Loading from "../components/Loading";
import { AnimatePresence } from "framer-motion";
import playSounds from "../lib/playSounds";
import shortid from "shortid";
import { motion } from "framer-motion";
import useMobileDetect from "../hooks/useMobileDetect";
import useWindowSize from "../hooks/useWindowSize";
import { i18n } from "../lib/i18n";

export default () => {
  const network = useNetwork();
  const router = useRouter();
  const [lastSound, setLastSound] = useState<number>(0);

  useEffect(() => {
    i18n.changeLanguage(router.locale as ILanguage);
  }, []);

  // using this for side effects that depend on the previous game state
  // e.g. sounds or forwarding the player to the next game
  const reducer = (game: IGame, newGame: IGame): IGame => {
    if (Date.now() - lastSound > 300) {
      const soundWasPlayed = playSounds(newGame, game);
      if (soundWasPlayed) {
        setLastSound(Date.now());
      }
    }

    if (
      game &&
      game.id === newGame.id &&
      !game.nextGameId &&
      newGame.nextGameId
    ) {
      router.push("/[gameId]", `/${newGame.nextGameId}`);
    }

    return newGame;
  };

  const [game, setGame] = useReducer(reducer, null);
  const [player, setPlayer] = useLocalStorage("localPlayer", {
    id: shortid.generate(),
  });
  const [gameView, setGameView] = useState<IGameView>({
    game,
    playerId: player.id,
  });

  const windowSize = useWindowSize();
  const isKeyboardOpen = windowSize.height < 300;
  const mobileDetect = useMobileDetect();

  // subscribe to game updates
  useEffect(() => {
    if (network) {
      return network.subscribeToGame(
        router.query.gameId as string,
        (newGame) => {
          setGame(newGame);
        }
      );
    }
  }, [network]);

  // update the game view when the game or the player changes
  useEffect(() => {
    setGameView({ game, playerId: player.id });
  }, [game, player]);

  return (
    <GameViewContext.Provider value={gameView}>
      <AnimatePresence>
        {!game && (
          <div className="absolute flex w-screen h-screen bg-gray-100">
            <Loading />
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col w-screen h-screen max-h-screen text-sm bg-gray-100 lg:flex-row lg:text-base">
        <AnimatePresence>
          {!(mobileDetect.isMobile() && isKeyboardOpen) && (
            <motion.div
              initial={{ height: "auto", opacity: 1 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex lg:w-3/12 lg:h-screen"
            >
              <div className="w-full h-full p-2 lg:p-6">
                <RoomInfo />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex px-2 lg:w-6/12 lg:p-6 lg:flex-grow">
          <GameBoard />
        </div>
        <div className="flex-grow h-40 focus:h-full p-2 lg:w-4/12 lg:p-6 lg:h-full lg:flex-grow-0">
          <Chat />
        </div>
      </div>
    </GameViewContext.Provider>
  );
};
