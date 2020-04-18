import dictionnaryFr from "./dictionnary-fr";
import dictionnaryEn from "./dictionnary-en";
import { shuffle } from "lodash";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import {
  IGame,
  ClassicGridItem,
  DuetGridItem,
  IGameOptions,
  IGameMode,
  defaultOptions,
  IDuetGrid,
  IClassicGrid,
  IGrid,
} from "./game";

const dictionnaries = {
  en: dictionnaryEn.split("\n"),
  fr: dictionnaryFr.split("\n"),
};

export default (opts?: Partial<IGameOptions>) => {
  const options: IGameOptions = {
    ...defaultOptions,
    ...opts,
  };

  const randomWords = shuffle(dictionnaries[options.language]).slice(0, 25);
  const randomStart = Math.random() < 0.5 ? "red" : "blue";
  const game: IGame = {
    words: randomWords,
    options,
    players: {},
    status: "lobby",
    grid: getGrid(options.mode, randomStart),
    turns: [],
    id: getId(),
    createdAt: Date.now(),
    playing: randomStart,
    chat: [
      {
        playerId: "",
        timestamp: Date.now(),
        message: "The game was created",
      },
    ],
  };

  return game;
};

function getGrid(mode: IGameMode, whoStarts: "red" | "blue"): IGrid {
  const cardsCount = 25;
  let grid = [];

  let counts;

  if (mode === "classic") {
    counts = {
      [ClassicGridItem.Red]: [0, 8 + (whoStarts === "red" ? 1 : 0)],
      [ClassicGridItem.Blue]: [0, 8 + (whoStarts === "blue" ? 1 : 0)],
      [ClassicGridItem.Black]: [0, 1],
      [ClassicGridItem.Neutral]: [0, 7],
    };
  } else if (mode === "duet") {
    counts = {
      [DuetGridItem.GB]: [0, 1],
      [DuetGridItem.GN]: [0, 5],
      [DuetGridItem.GG]: [0, 3],
      [DuetGridItem.BG]: [0, 1],
      [DuetGridItem.BB]: [0, 1],
      [DuetGridItem.BN]: [0, 1],
      [DuetGridItem.NG]: [0, 5],
      [DuetGridItem.NB]: [0, 1],
      [DuetGridItem.NN]: [0, 7],
    };
  }
  const statii = Object.keys(counts);

  for (let i = 0; i < cardsCount; i++) {
    let random = Math.random();

    for (let s = 0; s < statii.length; s++) {
      const status = statii[s];
      let [current, target] = counts[status];
      random -= (target - current) / (cardsCount - grid.length);
      if (random < 0) {
        grid.push(status);
        counts[status][0] = current + 1;
        break;
      }
    }
  }

  return grid;
}

const getId = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, adjectives, colors, animals],
    length: 4,
    separator: "",
    style: "capital",
  });
