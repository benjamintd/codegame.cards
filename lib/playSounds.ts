import { IGame } from "./game";

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
    playSound("/reveal.wav");
    return true;
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
  audio.play().catch((e) => {
    // Playing a sound before any user interaction triggers an error
    // Prevent it from polluting the error logs
    // @see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    if (e.name === "NotAllowedError") {
      return;
    }

    throw e;
  });
};
