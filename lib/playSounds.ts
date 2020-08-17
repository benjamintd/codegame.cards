import { IGame } from "./game";
import { useScores } from "../hooks/game";
import { findLast } from "lodash";

export default (newGame: IGame, game: IGame): boolean => {
  if (!game || !newGame || game.id !== newGame.id) {
    return;
  }

  if (
    Object.keys(game.players || {}).length !==
    Object.keys(newGame.players || {}).length
  ) {
    playSound("/new-player.wav");
    return true;
  }

  if (
    Object.values(game.turns || []).filter((t) => t.type === "click").length !==
    Object.values(newGame.turns || []).filter((t) => t.type === "click").length
  ) {
    const lastTurn = findLast(newGame.turns, (t) => t.type === "click");
    const lastClicker = newGame.players[lastTurn.from];

    if (lastTurn && lastClicker) {
      let prevScore,
        newScore = 0;

      const prevScores = useScores({
        playerId: "",
        game: game,
      });
      const newScores = useScores({
        playerId: "",
        game: newGame,
      });

      if (game.options.mode === "classic") {
        prevScore = prevScores[lastClicker.team];
        newScore = newScores[lastClicker.team];
      } else {
        prevScore = prevScores.duet;
        newScore = newScores.duet;
      }

      if (newScore > prevScore) {
        playSound("/reveal.wav");
      } else {
        playSound("/error.wav");
      }
      return true;
    }
  }

  if (
    Object.values(game.chat || []).length <
    Object.values(newGame.chat || []).length
  ) {
    playSound("/chat.wav");
    return true;
  }

  return false;
};

const playSound = (path) => {
  const audio = new Audio(path);
  audio.volume = 0.4;
  const prom = audio.play();

  if (prom) {
    prom.catch((e) => {
      // Playing a sound before any user interaction triggers an error
      // Prevent it from polluting the error logs
      // @see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
      if (e.name === "NotAllowedError") {
        return;
      }
      console.error(e);
    });
  }
};
