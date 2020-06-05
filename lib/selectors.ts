import {
  IGameView,
  IChatMessage,
  ITurn,
  IPlayers,
  IGameMode,
  ICardView,
  ClassicGridItem,
  IHintTurn,
  ITeam,
  IDuetGrid,
  IClassicGrid,
  isClassicGame,
  isClassicGrid,
  Color,
  isDuetGame,
  DuetGridItem,
  IPlayer,
  IGame,
  IClassicGame,
} from "./game";
import { createSelector } from "reselect";
import { findLast } from "lodash";

export const chatSelector = (gameView: IGameView): string[] =>
  Object.keys(gameView.game?.chat || {});

export const gridSelector = (gameView: IGameView): IClassicGrid | IDuetGrid => {
  if (isClassicGame(gameView.game)) {
    return (gameView.game?.grid.map((e) => +e) || []) as IClassicGrid;
  } else if (isDuetGame(gameView.game)) {
    return (gameView.game?.grid.map((e) => +e) || []) as IDuetGrid;
  } else {
    return [];
  }
};

export const gameSelector = (gameView: IGameView): IGame => gameView.game;

export const wordsSelector = (gameView: IGameView): string[] =>
  gameView.game?.words || [];

export const turnsSelector = (gameView: IGameView): ITurn[] =>
  Object.values(gameView.game?.turns || []);

export const playersSelector = (gameView: IGameView): IPlayers =>
  gameView.game?.players || {};

export const selfIdSelector = (gameView: IGameView): string =>
  gameView.playerId;

export const gameModeSelector = (gameView: IGameView): IGameMode =>
  gameView.game?.options?.mode || "classic";

export const selfPlayerSelector = createSelector(
  playersSelector,
  selfIdSelector,
  (players, id) => players[id]
);

export const boardViewSelector = createSelector(
  wordsSelector,
  gridSelector,
  turnsSelector,
  selfPlayerSelector,
  playersSelector,
  (words, grid, turns, selfPlayer, players): ICardView[] => {
    // classic grid
    if (isClassicGrid(grid)) {
      return words.map((word, i) => {
        const g = grid[i];
        const cardView: ICardView = {
          word,
          color:
            g === ClassicGridItem.Black
              ? Color.Black
              : g === ClassicGridItem.Blue
              ? Color.Blue
              : g === ClassicGridItem.Red
              ? Color.Red
              : Color.Neutral,
          shown: false,
          revealed: false,
        };
        if (selfPlayer && selfPlayer.spymaster) {
          cardView.shown = true;
        }

        if (
          Object.values(turns).filter(
            (t) => t.type === "click" && t.value === i
          ).length > 0
        ) {
          cardView.revealed = true;
          cardView.shown = true;
        }

        return cardView;
      });
    } else {
      // duet grid
      return words.map((word, i) => {
        const g = grid[i];
        const cardView: ICardView = {
          word,
          color: getDuetColor(g, selfPlayer?.team),
          shown: !!selfPlayer,
          revealed: false,
        };

        const playTurns = turns.filter(
          (t) => t.type === "click" && t.value === i
        );
        for (let turn of playTurns) {
          const whoClicked = players[turn.from];
          const revealedColor = getDuetColor(
            g,
            whoClicked.team === "duetA" ? "duetB" : "duetA"
          );

          if (revealedColor === Color.Neutral) {
            cardView.duetMarker = true;
          } else {
            cardView.revealed = true;
            cardView.color = revealedColor;
          }
        }

        return cardView;
      });
      // @todo the duet version here where each player sees a different grid
    }
  }
);

function getDuetColor(g: DuetGridItem, team: IPlayer["team"]) {
  switch (team) {
    case "duetA":
      if ([DuetGridItem.BB, DuetGridItem.BG, DuetGridItem.BN].indexOf(g) > -1) {
        return Color.Black;
      } else if (
        [DuetGridItem.GB, DuetGridItem.GG, DuetGridItem.GN].indexOf(g) > -1
      ) {
        return Color.Green;
      } else {
        return Color.Neutral;
      }
      break;
    case "duetB":
      if ([DuetGridItem.GB, DuetGridItem.NB, DuetGridItem.BB].indexOf(g) > -1) {
        return Color.Black;
      } else if (
        [DuetGridItem.BG, DuetGridItem.NG, DuetGridItem.GG].indexOf(g) > -1
      ) {
        return Color.Green;
      } else {
        return Color.Neutral;
      }
    default:
      return Color.Neutral;
  }
}

export const scoresSelector = createSelector(
  turnsSelector,
  gameSelector,
  playersSelector,
  (turns, game, players): { red: number; blue: number; duet: number } => {
    // classic game score
    if (isClassicGame(game)) {
      const grid = gridSelector({ playerId: "", game }) as IClassicGrid;
      return turns.reduce(
        (acc, turn) => {
          if (turn.type === "click") {
            if (grid[turn.value] === ClassicGridItem.Red) {
              acc.red = acc.red + 1;
            } else if (grid[turn.value] === ClassicGridItem.Blue) {
              acc.blue = acc.blue + 1;
            }
          }
          return acc;
        },
        { red: 0, blue: 0, duet: 0 }
      );
    }

    // duet game score
    if (isDuetGame(game)) {
      const grid = gridSelector({ playerId: "", game }) as IDuetGrid;
      return turns.reduce(
        (acc, turn) => {
          if (turn.type === "click") {
            if (
              [DuetGridItem.GB, DuetGridItem.GN].indexOf(grid[turn.value]) >
                -1 &&
              players[turn.from].team === "duetB"
            ) {
              acc.duet = acc.duet + 1;
            } else if (
              [DuetGridItem.BG, DuetGridItem.NG].indexOf(grid[turn.value]) >
                -1 &&
              players[turn.from].team === "duetA"
            ) {
              acc.duet = acc.duet + 1;
            } else if (grid[turn.value] === DuetGridItem.GG) {
              acc.duet = acc.duet + 1;
            }
          }
          return acc;
        },
        { red: 0, blue: 0, duet: 0 }
      );
    }

    // default return for empty game
    return { red: 0, blue: 0, duet: 0 };
  }
);

export const maxScoresSelector = createSelector(gridSelector, (grid): {
  red: number;
  blue: number;
  duet: number;
} => {
  if (isClassicGrid(grid)) {
    return grid.reduce(
      (acc, value) => {
        if (value === ClassicGridItem.Red) {
          acc.red = acc.red + 1;
        } else if (value === ClassicGridItem.Blue) {
          acc.blue = acc.blue + 1;
        }

        return acc;
      },
      { red: 0, blue: 0, duet: 0 }
    );
  } else {
    return { red: 0, blue: 0, duet: 15 };
  }
});

export const lastHintselector = createSelector(turnsSelector, (turns: ITurn[]):
  | IHintTurn
  | undefined => {
  return findLast(turns, (t) => t.type === "hint") as IHintTurn;
});

export const duetTurnsSelector = createSelector(
  turnsSelector,
  gameModeSelector,
  (turns, mode) => {
    if (mode !== "duet") {
      return 0;
    }

    return turns.filter((t) => t.type === "hint").length;
  }
);

export const gameOverSelector = createSelector(
  playersSelector,
  turnsSelector,
  scoresSelector,
  maxScoresSelector,
  gridSelector,
  gameModeSelector,
  duetTurnsSelector,
  (
    players,
    turns,
    scores,
    maxScores,
    grid,
    mode,
    duetTurns
  ): { over: boolean; winner?: ITeam; message?: string } => {
    if (mode === "classic") {
      for (const team of ["blue", "red"] as ITeam[]) {
        if (scores[team] === maxScores[team]) {
          return { over: true, winner: team };
        }
      }

      const blackIndex = grid.findIndex((g) => g === ClassicGridItem.Black);
      const blackTurn = turns.find(
        (t) => t.type === "click" && t.value === blackIndex
      );
      if (blackTurn) {
        return {
          over: true,
          winner: players[blackTurn.from].team === "red" ? "blue" : "red",
        };
      }
      return { over: false };
    }

    if (mode === "duet") {
      // all green cards have been played
      if (scores.duet === maxScores.duet) {
        return { over: true, message: "won" };
      }

      // There was a black click
      const blackTurn = turns.find((t) => {
        if (t.type === "click") {
          const color = getDuetClickTurnColor(t, players, grid);
          if (color === Color.Black) {
            return true;
          }
        }
        return false;
      });
      if (blackTurn) {
        return {
          over: true,
          message: "black-card-loss",
        };
      }

      // There were more than 9 turns + misclicks
      if (duetTurns > 9) {
        return {
          over: true,
          message: "out-of-time-loss",
        };
      }

      // Otherwise the game is not over.
      return { over: false };
    }
  }
);

function getDuetClickTurnColor(turn, players, grid) {
  if (turn.type !== "click") {
    throw new Error("should not get color from non click event");
  }

  const player = players[turn.from];
  const g = grid[turn.value];
  return getDuetColor(g, player.team === "duetA" ? "duetB" : "duetA");
}
