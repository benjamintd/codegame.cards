import dictionnaryFr from "./dictionnary-fr";
import dictionnaryEn from "./dictionnary-en";
import dictionnaryDe from "./dictionnary-de";
import { shuffle } from "lodash";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import {
  ClassicGridItem,
  DuetGridItem,
  IGameOptions,
  defaultOptions,
  IClassicGrid,
  IDuetGrid,
} from "./game";

const dictionnaries = {
  en: dictionnaryEn,
  fr: dictionnaryFr,
  de: dictionnaryDe,
};

export default (opts?: Partial<IGameOptions>) => {
  let options: IGameOptions = {
    ...defaultOptions,
    ...opts,
  };

  const words = shuffle(dictionnaries[options.language].split("\n")).slice(
    0,
    25
  );

  const id = getId();
  const createdAt = Date.now();

  if (options.mode === "classic") {
    const randomStart = Math.random() < 0.5 ? "red" : "blue";

    return {
      words,
      options,
      players: {},
      grid: getClassicGrid(randomStart),
      turns: [],
      id,
      createdAt,
      chat: [
        {
          playerId: "",
          timestamp: Date.now(),
          message: `The game was created. The ${randomStart} team starts.`,
        },
      ],
    };
  }

  if (options.mode === "duet") {
    return {
      words,
      options,
      players: {},
      grid: getDuetGrid(),
      turns: [],
      id,
      createdAt,
      chat: [
        {
          playerId: "",
          timestamp: Date.now(),
          message: `The game was created. Give a hint to get started.`,
        },
      ],
    };
  }
};

function getClassicGrid(whoStarts: "red" | "blue"): IClassicGrid {
  const counts = {
    [ClassicGridItem.Red]: [0, 8 + (whoStarts === "red" ? 1 : 0)],
    [ClassicGridItem.Blue]: [0, 8 + (whoStarts === "blue" ? 1 : 0)],
    [ClassicGridItem.Black]: [0, 1],
    [ClassicGridItem.Neutral]: [0, 7],
  };

  return getRandomGrid(counts);
}

function getDuetGrid(): IDuetGrid {
  const counts = {
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

  return getRandomGrid(counts);
}

const getId = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, adjectives, colors, animals],
    length: 4,
    separator: "",
    style: "capital",
  });

const getRandomGrid = (counts) => {
  const cardsCount = 25;
  const statii = Object.keys(counts);
  let grid = [];
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
};
