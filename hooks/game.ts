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
import React, { useContext, useState, useEffect, useReducer } from "react";
import useNetwork, { Network } from "./network";
import { shuffle, mapValues, mapKeys } from "lodash";
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

import { logEvent } from "../lib/analytics";

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

export function useChatMessage(id: string, network: Network = useNetwork()) {
  const [message, setMessage] = useState<IChatMessage>(null);

  useEffect(() => {
    if (!message) {
      network.db.ref(`/chats/${id}`).once("value", (event) => {
        let chat = event.val();
        if (chat) {
          setMessage(chat);
        }
      });
    }
  }, [message, id]);

  return message;
}

export function useSendChat(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  return async (chat: IChatMessage) => {
    const game = gameView.game;
    const chatRef = network.db.ref(`/games/${game.id}/chat`).push();
    await network.update({
      [`/chats/${chatRef.key}`]: chat,
      [`/games/${game.id}/chat/${chatRef.key}`]: true,
    });

    logEvent("sendchat", chat.type);
  };
}

export function usePresence(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  // update our presence every second
  return useEffect(() => {
    if (typeof window !== "undefined" && gameView.playerId) {
      network.updateKey(`/presence/${gameView.playerId}`, Date.now());

      const interval = window.setInterval(() => {
        network.updateKey(`/presence/${gameView.playerId}`, Date.now());
      }, 10000); // ping the server every 10 seconds

      return () => window.clearInterval(interval);
    }
  }, [gameView.playerId]);
}

export function usePlayersPresences(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  // update a state {[playerId]: something } with a new object
  const presenceReducer = (
    state,
    { type, ids }: { type?: "init" | "update"; ids: { [key: string]: any } }
  ) => {
    if (type === "init") {
      return { ...ids, ...state };
    } else {
      return { ...state, ...ids };
    }
  };

  // we need to store the remote timestamps to check if they change
  const [remoteTs, updateRemoteTs] = useReducer(
    presenceReducer,
    {} as { [key: string]: number }
  );

  // we store our own timestamps in case the server and the client have different clocks
  const [presTs, updateTs] = useReducer(
    presenceReducer,
    {} as { [key: string]: number }
  );

  // the reduced true/false object that is used by the UI
  const [presences, updatePresences] = useReducer(
    presenceReducer,
    {} as { [key: string]: boolean }
  );

  const players = gameView?.game?.players;

  // update the presence timestamp anytime we get an update from the server
  // which gives a different timestamp than last time
  useEffect(() => {
    if (!players) {
      return;
    }
    // fill the missing values with now.
    updateTs({ type: "init", ids: mapValues(players, Date.now) });

    const interval = setInterval(async () => {
      const promises = Object.keys(players).map(
        (id: string) =>
          new Promise<void>((resolve) => {
            const ref = network.db.ref(`/presence/${id}`);
            ref.once("value", (val) => {
              if (remoteTs[id] !== val.val()) {
                updateTs({ ids: { [id]: Date.now() } });
                updateRemoteTs({ ids: { [id]: val.val() } });
              }
              resolve();
            });
          })
      );

      await Promise.all(promises);
      updateTs({ ids: [] }); // update no matter what to trigger
    }, 10000);

    return () => clearInterval(interval);
  }, [players, remoteTs]);

  // update the true/false presence anytime the presTs changes
  useEffect(() => {
    // fill missing values with true
    updatePresences({ type: "init", ids: mapValues(players, () => true) });
    const now = Date.now();
    updatePresences({
      ids: mapValues(presTs, (ts) => now - ts < 25000),
    });
  }, [players, presTs]);

  return presences;
}

export function useAddPlayer(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  return async (player: IPlayer) => {
    const game = gameView.game;

    const chat = {
      type: "player-joined",
      timestamp: Date.now(),
      playerName: player.name,
    };
    const chatRef = network.db.ref(`/games/${game.id}/chat`).push();

    await network.update({
      [`/chats/${chatRef.key}`]: chat,
      [`/games/${game.id}/chat/${chatRef.key}`]: true,
      [`/games/${game.id}/players/${player.id}`]: player,
    });

    logEvent("addplayer", player.id);
  };
}

export function usePushTurn(
  gameView: IGameView = useGameView(),
  network: Network = useNetwork()
) {
  return async (turn: ITurn) => {
    const game = gameView.game;
    const chat = getTurnChat(turn, game);
    const chatRef = network.db.ref(`/games/${game.id}/chat`).push();
    const turnRef = network.db.ref(`/games/${game.id}/turns`).push();

    await network.update({
      [`/chats/${(await chatRef).key}`]: chat,
      [`/games/${game.id}/chat/${chatRef.key}`]: true,
      [`/games/${game.id}/turns/${turnRef.key}`]: turn,
    });

    logEvent("playturn", turn.from);
  };
}

function getTurnChat(turn: ITurn, game: IGame): IChatMessage {
  if (turn.type === "click") {
    const player = game.players[turn.from];
    const word = game.words[turn.value];
    const color = +game.grid[turn.value];

    if (!player) {
      return;
    }

    let reaction = "";
    if (isClassicGame(game)) {
      reaction = getClassicReaction(color, player);
    }

    if (isDuetGame(game)) {
      reaction = getDuetReaction(color, player);
    }

    return {
      type: "click",
      timestamp: Date.now(),
      playerId: turn.from,
      word,
      reaction,
    };
  }

  if (turn.type === "hint") {
    return {
      type: "hint",
      timestamp: Date.now(),
      playerId: turn.from,
      hint: turn.hint,
    };
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

      const sendChat = useSendChat({ playerId: "", game: game }, network);

      await sendChat({
        type: "game-created",
        timestamp: Date.now(),
      });

      if (options?.forward) {
        await network.updateKey(
          `/games/${gameView.game.id}/nextGameId`,
          game.id
        );
      }

      logEvent(
        "newgame",
        `${gameOptions?.language}-${gameOptions?.mode}-${gameOptions?.private}`
      );
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
      "positive-reaction-1",
      "positive-reaction-2",
      "positive-reaction-3",
      "positive-reaction-4",
      "positive-reaction-5",
      "positive-reaction-6",
    ])[0];
  } else if (g === ClassicGridItem.Neutral) {
    reaction = shuffle([
      "neutral-reaction-1",
      "neutral-reaction-2",
      "neutral-reaction-3",
      "neutral-reaction-4",
      "neutral-reaction-5",
      "neutral-reaction-6",
    ])[0];
  } else if (g === ClassicGridItem.Black) {
    reaction = shuffle([
      "black-reaction-1",
      "black-reaction-2",
      "black-reaction-3",
    ])[0];
  } else {
    reaction = shuffle([
      "negative-reaction-1",
      "negative-reaction-2",
      "negative-reaction-3",
      "negative-reaction-4",
      "negative-reaction-5",
    ])[0];
  }

  return reaction;
}

function getDuetReaction(g: DuetGridItem, player: IPlayer): string {
  const positive = shuffle([
    "positive-reaction-1",
    "positive-reaction-2",
    "positive-reaction-3",
    "positive-reaction-4",
    "positive-reaction-5",
    "positive-reaction-6",
  ])[0];

  const negative = shuffle([
    "neutral-reaction-1",
    "neutral-reaction-2",
    "neutral-reaction-3",
    "neutral-reaction-4",
    "neutral-reaction-5",
    "neutral-reaction-6",
  ])[0];

  const lost = shuffle(["black-reaction-1", "black-reaction-4"])[0];

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
