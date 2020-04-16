import React, { useContext } from "react";

import { IGame } from "../lib/game";

export const NetworkContext = React.createContext<Network>(null);

export type GamesHandler = (games: IGame[]) => void;

export type GameHandler = (game: IGame) => void;

export type UnsubscribeHandler = () => void;

export interface Network {
  getPublicGames(callback: GamesHandler): void;

  subscribeToOnGoingGames(callback: GamesHandler): UnsubscribeHandler;

  subscribeToGame(gameId: string, callback: GameHandler): UnsubscribeHandler;

  updateGame(game: IGame): Promise<void>;
}

export default function useNetwork() {
  return useContext(NetworkContext);
}
