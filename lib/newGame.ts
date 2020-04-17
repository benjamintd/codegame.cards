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
  ClassicGridStatus,
  DuetGridStatus,
  IGameOptions,
  IGameMode,
  defaultOptions,
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

  const game: IGame = {
    words: randomWords,
    options,
    players: {},
    status: "lobby",
    grid: getGrid(options.mode),
    turns: [],
    id: getId(),
    createdAt: Date.now(),
    chat: [
      {
        playerId: "",
        timestamp: Date.now(),
        message: "The game was created!",
      },
    ],
  };

  return game;
};

function getGrid(mode: IGameMode): DuetGridStatus[] | ClassicGridStatus[] {
  const cardsCount = 25;
  let grid = [];

  let counts;

  if (mode === "classic") {
    const whoStarts = Math.round(Math.random());
    counts = {
      [ClassicGridStatus.Red]: [0, 8 + whoStarts],
      [ClassicGridStatus.Blue]: [0, 8 + (1 - whoStarts)],
      [ClassicGridStatus.Black]: [0, 1],
      [ClassicGridStatus.Neutral]: [0, 7],
    };
  } else if (mode === "duet") {
    counts = {
      [DuetGridStatus.GB]: [0, 1],
      [DuetGridStatus.GN]: [0, 5],
      [DuetGridStatus.GG]: [0, 3],
      [DuetGridStatus.BG]: [0, 1],
      [DuetGridStatus.BB]: [0, 1],
      [DuetGridStatus.BN]: [0, 1],
      [DuetGridStatus.NG]: [0, 5],
      [DuetGridStatus.NB]: [0, 1],
      [DuetGridStatus.NN]: [0, 7],
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
