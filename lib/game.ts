export interface IGame {
  players: IPlayers;
  words: string[];
  grid: IGrid;
  turns: ITurn[];
  status: "lobby" | "started" | "ended";
  id: string;
  playing: "red" | "blue";
  chat: IChatMessage[];
  options: IGameOptions;
  createdAt: number; // timestamp
  nextGameId?: string;
}

export type IPlayers = { [key: string]: IPlayer };

export interface IGameView {
  playerId: string;
  game: IGame;
}

export interface IGameOptions {
  mode: IGameMode;
  language: ILanguage;
}

export type IGameMode = "duet" | "classic";
export type ILanguage = "fr" | "en";
export type ITeam = "red" | "blue";

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

export type IClassicGrid = ClassicGridItem[];
export type IDuetGrid = DuetGridItem[];
export type IGrid = IClassicGrid; // @todo add back duet grid when ready | IDuetGrid;

export const defaultOptions: IGameOptions = {
  language: "en",
  mode: "classic",
};

export interface ICardView {
  word: string;
  revealed: boolean;
  shown: boolean; // for spymasters to see unrevealed cards
  color: ClassicGridItem; // @todo take duet into account here
}
