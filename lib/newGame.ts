import dictionnary from "./dictionnary";
import { shuffle } from "lodash";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { IGame, GridStatus } from "./game";

const words = dictionnary.split("\n");

export default () => {
  const randomWords = shuffle(words).slice(0, 25);
  const game: IGame = {
    words: randomWords,
    players: {},
    status: "lobby",
    grid: getGrid(),
    turns: [],
    id: getId(),
    createdAt: new Date().getTime(),
  };

  return game;
};

function getGrid() {
  let r = 0;
  let b = 0;
  let black = 0;
  const maxR = Math.random() > 0.5 ? 9 : 8;
  const maxB = maxR === 9 ? 8 : 9;
  const maxBlack = 1;
  const cardsCount = 25;

  let grid = [];
  for (let i = 0; i < 25; i++) {
    let random = Math.random();

    random -= (maxR - r) / (cardsCount - grid.length);
    if (random < 0) {
      grid.push(GridStatus.Red);
      r += 1;
      continue;
    }

    random -= (maxB - b) / (cardsCount - grid.length);
    if (random < 0) {
      grid.push(GridStatus.Blue);
      b += 1;
      continue;
    }

    random -= (maxBlack - black) / (cardsCount - grid.length);
    if (random < 0) {
      grid.push(GridStatus.Black);
      black += 1;
      continue;
    }

    grid.push(GridStatus.Neutral);
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
