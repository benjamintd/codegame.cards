import React, { useContext } from "react";

import { IGame, IChatMessage } from "../lib/game";

export const NetworkContext = React.createContext<Network>(null);

export type GamesHandler = (games: IGame[]) => void;

export type GameHandler = (game: IGame) => void;

export type ChatHandler = (chat: IChatMessage) => void;

export type UnsubscribeHandler = () => void;

export interface Network {
  getPublicGames(callback: GamesHandler): void;

  subscribeToGame(gameId: string, callback: GameHandler): UnsubscribeHandler;

  updateGame(game: IGame): Promise<void>;

  updateKey(key: string, value: any): Promise<void>;

  update(obj: { [key: string]: any }): Promise<void>;
}

export default function useNetwork() {
  return useContext(NetworkContext);
}
