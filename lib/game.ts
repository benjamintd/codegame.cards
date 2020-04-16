export interface IGame {
  players: { [key: string]: IPlayer };
  words: string[];
  grid: GridStatus[];
  turns: ITurn[];
  status: "lobby" | "started" | "ended";
  id: string;
  createdAt: number; // timestamp
}

export interface IPlayer {
  team: "red" | "blue";
  spymaster: boolean;
  name: string;
  id: string;
  host: boolean;
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

export enum GridStatus {
  Neutral = 1,
  Red,
  Blue,
  Black,
}
