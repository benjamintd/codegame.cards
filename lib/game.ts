export type IGame = IClassicGame | IDuetGame;

export interface IClassicGame {
  players: IPlayers;
  words: string[];
  grid: IClassicGrid;
  turns: ITurn[];
  id: string;
  chat: IChatMessage[];
  options: { mode: "classic"; language: ILanguage; private: IPrivate };
  createdAt: number; // timestamp
  nextGameId?: string;
}

export interface IDuetGame {
  players: IPlayers;
  words: string[];
  grid: IDuetGrid;
  turns: ITurn[];
  id: string;
  chat: IChatMessage[];
  options: { mode: "duet"; language: ILanguage; private: IPrivate };
  createdAt: number; // timestamp
  nextGameId?: string;
}

export type IGrid = IClassicGrid | IDuetGrid;

export interface IGameView {
  playerId: string;
  game: IGame;
}

export interface IGameOptions {
  mode: IGameMode;
  language: ILanguage;
  private: IPrivate;
}

export type IPrivate = "public" | "private";
export type IGameMode = "duet" | "classic";
export type ILanguage = "fr" | "en" | "de" | "es" | "emoji";
export type ITeam = "red" | "blue" | "duetA" | "duetB";

export interface IPlayer {
  team: ITeam;
  spymaster: boolean;
  name: string;
  id: string;
  clickedOn: number;
}

export type IPlayers = { [key: string]: IPlayer };

export interface IChatMessage {
  playerId: string;
  timestamp: number;
  message: string;
  format?: string;
}

export type ITurn = IPassTurn | IClickTurn | IHintTurn;

export interface IPassTurn {
  type: "pass";
  from: string;
}

export interface IClickTurn {
  type: "click";
  value: number;
  from: string;
}

export interface IHintTurn {
  type: "hint";
  value?: number;
  hint: string;
  from: string;
}

export enum ClassicGridItem {
  Neutral = 1,
  Red,
  Blue,
  Black,
}

export enum DuetGridItem {
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

export enum Color {
  Neutral,
  Red,
  Blue,
  Black,
  Green,
}

export type IClassicGrid = ClassicGridItem[];
export type IDuetGrid = DuetGridItem[];

export const defaultOptions: IGameOptions = {
  language: "en",
  mode: "classic",
  private: "public",
};

export interface ICardView {
  word: string;
  revealed: boolean;
  shown: boolean; // for spymasters to see unrevealed cards
  color: Color;
  duetMarker?: boolean;
}

export function isDuetGame(game: IGame): game is IDuetGame {
  return game?.options?.mode === "duet";
}

export function isClassicGame(game: IGame): game is IClassicGame {
  return game?.options?.mode === "classic";
}

export function isClassicGrid(grid: IGrid): grid is IClassicGrid {
  return grid.findIndex((e) => e === DuetGridItem.NN) === -1;
}

export function isDuetGrid(grid: IGrid): grid is IDuetGrid {
  return grid.findIndex((e) => e === DuetGridItem.NN) > -1;
}
