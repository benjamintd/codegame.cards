import { IGame } from "./game";

export default (newGame: IGame, game: IGame) => {
  if (!game || !newGame) {
    return;
  }

  if (
    (game.turns || []).filter((t) => t.type === "click").length !==
    (newGame.turns || []).filter((t) => t.type === "click").length
  ) {
    return playSound("/reveal.wav");
  }

  if (game.chat?.length !== newGame.chat?.length) {
    return playSound("/chat.wav");
  }
};

const playSound = (path) => {
  const audio = new Audio(path);
  audio.volume = 0.5;
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
