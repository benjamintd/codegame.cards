import {
  IGameView,
  IChatMessage,
  ITurn,
  IPlayers,
  IPlayer,
  IGameMode,
  ClassicGridItem,
  IClassicGrid,
  ICardView,
} from "../lib/game";
import React, { useContext } from "react";
import { createSelector } from "reselect";
import produce from "immer";
import useNetwork, { Network } from "./network";

export const GameViewContext = React.createContext(null);

export function useGameView(): IGameView {
  const gameView = useContext<IGameView>(GameViewContext);

  return gameView;
}

export function useChat(gameView: IGameView = useGameView()) {
  return chatSelector(gameView);
}

export function useBoardView(gameView: IGameView = useGameView()) {
  return boardViewSelector(gameView);
}

export function usePlayers(gameView: IGameView = useGameView()) {
  return playersSelector(gameView);
}

export function useSelfPlayer(gameView: IGameView = useGameView()) {
  return selfPlayerSelector(gameView);
}

export function useGameMode(gameView: IGameView = useGameView()) {
  return gameModeSelector(gameView);
}

export function useSelfId(gameView: IGameView = useGameView()) {
  return selfIdSelector(gameView);
}

export function useScores(gameView: IGameView = useGameView()) {
  return scoresSelector(gameView);
}

export function useMaxScores(gameView: IGameView = useGameView()) {
  return maxScoresSelector(gameView);
}

export function useSendChat(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  return (chat: IChatMessage) => {
    const game = gameView.game;
    const newGame = produce(game, (g) => {
      g.chat.push(chat);
    });
    network.updateGame(newGame);
  };
}

export function useAddPlayer(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  return (player: IPlayer) => {
    const game = gameView.game;
    const newGame = produce(game, (g) => {
      g.players = g.players || {};
      g.players[player.id] = player;
    });
    network.updateGame(newGame);
  };
}

const chatSelector = (gameView: IGameView): IChatMessage[] =>
  gameView.game?.chat || [];

const gridSelector = (gameView: IGameView): IClassicGrid =>
  gameView.game?.grid.map((e) => +e) || [];

const wordsSelector = (gameView: IGameView): string[] =>
  gameView.game?.words || [];

const turnsSelector = (gameView: IGameView): ITurn[] =>
  gameView.game?.turns || [];

const playersSelector = (gameView: IGameView): IPlayers =>
  gameView.game?.players || {};

const selfIdSelector = (gameView: IGameView): string => gameView.playerId;

const gameModeSelector = (gameView: IGameView): IGameMode =>
  gameView.game?.options?.mode || "classic";

const selfPlayerSelector = createSelector(
  playersSelector,
  selfIdSelector,
  (players, id) => players[id]
);

const boardViewSelector = createSelector(
  wordsSelector,
  gridSelector,
  turnsSelector,
  selfPlayerSelector,
  (words, grid, turns, selfPlayer): ICardView[] => {
    return words.map((word, i) => {
      const g = grid[i];
      if (selfPlayer && selfPlayer.spymaster) {
        return { word, revealed: true, color: g };
      } else {
        if (
          turns.filter((t) => t.type === "click" && t.value === i).length > 0
        ) {
          return { word, revealed: true, color: g };
        } else {
          return { word, revealed: false, color: g };
        }
      }
    });
  }
);

const scoresSelector = createSelector(
  turnsSelector,
  gridSelector,
  (turns, grid): { red: number; blue: number } => {
    return turns.reduce(
      (acc, turn) => {
        if (turn.type === "click") {
          if (grid[turn.value] === ClassicGridItem.Red) {
            acc.red = acc.red + 1;
          } else if (grid[turn.value] === ClassicGridItem.Blue) {
            acc.blue = acc.blue + 1;
          }
        }
        return acc;
      },
      { red: 0, blue: 0 }
    );
  }
);

const maxScoresSelector = createSelector(gridSelector, (grid): {
  red: number;
  blue: number;
} => {
  return grid.reduce(
    (acc, value) => {
      if (value === ClassicGridItem.Red) {
        acc.red = acc.red + 1;
      } else if (value === ClassicGridItem.Blue) {
        acc.blue = acc.blue + 1;
      }

      return acc;
    },
    { red: 0, blue: 0 }
  );
});
