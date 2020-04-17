export interface IGame {
  players: { [key: string]: IPlayer };
  words: string[];
  grid: ClassicGridStatus[] | DuetGridStatus[];
  turns: ITurn[];
  status: "lobby" | "started" | "ended";
  id: string;
  chat: IChatMessage[];
  options: IGameOptions;
  createdAt: number; // timestamp
}

export interface IGameOptions {
  mode: IGameMode;
  language: ILanguage;
}

export type IGameMode = "duet" | "classic";
export type ILanguage = "fr" | "en";

export interface IPlayer {
  team: "red" | "blue";
  spymaster: boolean;
  name: string;
  id: string;
  clickedOn: number;
  host: boolean;
}

export interface IChatMessage {
  playerId: string;
  timestamp: number;
  message: string;
}

export type ITurn = IPassTurn | IClickTurn | IHintTurn;

export interface IPassTurn {
  type: "pass";
  from: string; // player id
}

export interface IClickTurn {
  type: "click";
  value: number;
  from: string; // player id
}

export interface IHintTurn {
  type: "hint";
  value: number;
  hint: string;
  from: string; // player id
}

export enum ClassicGridStatus {
  Neutral = 1,
  Red,
  Blue,
  Black,
}

export enum DuetGridStatus {
  GG = 1,
  GB,
  GN,
  BG,
  BB,
  BN,
  NG,
  NB,
  NN,
}

export const defaultOptions: IGameOptions = {
  language: "en",
  mode: "classic",
};
