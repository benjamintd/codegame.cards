import {
  IGameView,
  IChatMessage,
  ITurn,
  IPlayer,
  ClassicGridItem,
  IGame,
  isClassicGame,
  isDuetGame,
  DuetGridItem,
} from "../lib/game";
import React, { useContext } from "react";
import produce from "immer";
import useNetwork, { Network } from "./network";
import { shuffle } from "lodash";
import { useRouter } from "next/router";
import {
  chatSelector,
  boardViewSelector,
  playersSelector,
  selfPlayerSelector,
  gameModeSelector,
  selfIdSelector,
  scoresSelector,
  maxScoresSelector,
  lastHintselector,
  turnsSelector,
  gameOverSelector,
  duetTurnsSelector,
} from "../lib/selectors";
import FirebaseNetwork from "./firebase";

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

export function useGameOver(gameView: IGameView = useGameView()) {
  return gameOverSelector(gameView);
}

export function useDuetTurns(gameView: IGameView = useGameView()) {
  return duetTurnsSelector(gameView);
}

export function useSendChat(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  return async (chat: IChatMessage) => {
    const game = gameView.game;
    const chatRef = network.db.ref(`/games/${game.id}/chat`).push();
    await chatRef.set(chat);
  };
}

export function useAddPlayer(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  const sendChat = useSendChat(gameView, network);

  return async (player: IPlayer) => {
    const game = gameView.game;

    await sendChat({
      playerId: "",
      timestamp: Date.now(),
      message: `${player.name} just joined!`,
    });

    const newGame = produce(game, (g) => {
      g.players = g.players || {};
      g.players[player.id] = player;
    });

    await network.updateGame(newGame);
  };
}

export function usePushTurn(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  const sendChat = useSendChat(gameView, network);

  return async (turn: ITurn) => {
    const game = gameView.game;
    sendChat(getTurnChat(turn, game));
    const turnRef = network.db.ref(`/games/${game.id}/turns`).push();
    await turnRef.set(turn);
  };
}

function getTurnChat(turn: ITurn, game: IGame) {
  if (turn.type === "click") {
    const player = game.players[turn.from];
    const word = game.words[turn.value];
    const color = +game.grid[turn.value];
    if (player) {
      let reaction = "";
      if (isClassicGame(game)) {
        reaction = getClassicReaction(color, player);
      }

      if (isDuetGame(game)) {
        reaction = getDuetReaction(color, player);
      }

      return {
        playerId: "",
        timestamp: Date.now(),
        message: `${player.name} clicked on ${word}. ${reaction}`,
      };
    }
  } else {
    if (turn.type === "hint") {
      return {
        playerId: turn.from,
        timestamp: Date.now(),
        message: turn.hint,
        format: "font-bold",
      };
    }
  }
}

export function useNewGame(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  const router = useRouter();
  return async (gameOptions, options?: { forward: boolean }) => {
    try {
      const { game } = await fetch("/api/new-game", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(gameOptions),
      }).then((res) => res.json());
      await network.updateGame(game);

      if (options?.forward) {
        await network.updateKey(
          `/games/${gameView.game.id}/nextGameId`,
          game.id
        );
      }

      router.push("/[gameId]", `/${game.id}`);
    } catch (error) {
      console.log(error);
    }
  };
}

function getClassicReaction(g: ClassicGridItem, player: IPlayer): string {
  let reaction = "";

  if (
    (g === ClassicGridItem.Red && player.team === "red") ||
    (g === ClassicGridItem.Blue && player.team === "blue")
  ) {
    reaction = shuffle([
      "Nice!",
      "Good job!",
      "Strong move.",
      `One point for the ${player.team} team!`,
      "Yay!",
      "😎",
    ])[0];
  } else if (g === ClassicGridItem.Neutral) {
    reaction = shuffle([
      "That's a miss.",
      "Close enough.",
      "You'll get it next time.",
      "That was a civilian.",
      `Almost!`,
    ])[0];
  } else if (g === ClassicGridItem.Black) {
    reaction = shuffle([
      "You just lost the game!",
      `The ${player.team === "red" ? "blue" : "red"} team wins!`,
      "Your team loses ☠️",
    ])[0];
  } else {
    reaction = shuffle([
      "Whoops!",
      "Oh no!",
      `The ${player.team === "red" ? "blue" : "red"} team thanks you.`,
      "Don't worry you tried your best 💛.",
      "🤦‍♂️",
    ])[0];
  }

  return reaction;
}

function getDuetReaction(g: DuetGridItem, player: IPlayer): string {
  const positive = shuffle([
    "Nice!",
    "Good job!",
    "Strong move.",
    "Yay!",
    "😎",
  ])[0];

  const negative = shuffle([
    "That's a miss.",
    "Close enough.",
    "You'll get it next time.",
    "That was an innocent bypasser.",
    `Almost!`,
  ])[0];

  const lost = shuffle([
    "You just lost the game!",
    "Oh no, you clicked on an assassin ☠️",
  ])[0];

  switch (player.team) {
    case "duetB":
      if ([DuetGridItem.GB, DuetGridItem.GG, DuetGridItem.GN].indexOf(g) > -1) {
        return positive;
      } else if (
        [DuetGridItem.NB, DuetGridItem.NG, DuetGridItem.NN].indexOf(g) > -1
      ) {
        return negative;
      } else {
        return lost;
      }

    case "duetA":
      if ([DuetGridItem.BG, DuetGridItem.NG, DuetGridItem.GG].indexOf(g) > -1) {
        return positive;
      } else if (
        [DuetGridItem.BN, DuetGridItem.GN, DuetGridItem.NN].indexOf(g) > -1
      ) {
        return negative;
      } else {
        return lost;
      }
  }
}
