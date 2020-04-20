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
  IGame,
  IHintTurn,
} from "../lib/game";
import React, { useContext } from "react";
import { createSelector } from "reselect";
import produce from "immer";
import useNetwork, { Network } from "./network";
import { findLast } from "lodash";

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

export function useLastHint(gameView: IGameView = useGameView()) {
  return lastHintselector(gameView);
}

export function useTurns(gameView: IGameView = useGameView()) {
  return turnsSelector(gameView);
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

export function usePushTurn(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  return (turn: ITurn) => {
    const game = gameView.game;
    const newGame = produce(game, (g) => {
      g.turns = g.turns || [];

      if (isDuplicateTurn(turn, g.turns)) {
        return;
      }
      addTurnChat(turn, g);
      g.turns.push(turn);
    });
    network.updateGame(newGame);
  };
}

function isDuplicateTurn(turn: ITurn, turns: ITurn[]) {
  if (turn.type === "click") {
    if (turns.find((t) => t.type === "click" && t.value === turn.value)) {
      return true;
    }
  }
  return false;
}

function addTurnChat(turn: ITurn, game: IGame) {
  if (turn.type === "click") {
    const player = game.players[turn.from];
    const word = game.words[turn.value];
    const color = +game.grid[turn.value];
    if (player) {
      let reaction = "";

      if (
        (color === ClassicGridItem.Red && player.team === "red") ||
        (color === ClassicGridItem.Blue && player.team === "blue")
      ) {
        reaction = "Nice!";
      } else if (color === ClassicGridItem.Neutral) {
        reaction = "That's a miss.";
      } else if (color === ClassicGridItem.Black) {
        reaction = "You just lost the game!";
      } else {
        reaction = "Whoops!";
      }

      game.chat.push({
        playerId: "",
        timestamp: Date.now(),
        message: `${player.name} clicked on ${word}. ${reaction}`,
      });
    }
  } else {
    if (turn.type === "hint") {
      game.chat.push({
        playerId: turn.from,
        timestamp: Date.now(),
        message: turn.hint,
        format: "font-bold",
      });
    }
  }
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
      const cardView: ICardView = {
        word,
        color: g,
        shown: false,
        revealed: false,
      };
      if (selfPlayer && selfPlayer.spymaster) {
        cardView.shown = true;
      }

      if (turns.filter((t) => t.type === "click" && t.value === i).length > 0) {
        cardView.revealed = true;
        cardView.shown = true;
      }

      return cardView;
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

const lastHintselector = createSelector(turnsSelector, (turns: ITurn[]):
  | IHintTurn
  | undefined => {
  return findLast(turns, (t) => t.type === "hint") as IHintTurn;
});
