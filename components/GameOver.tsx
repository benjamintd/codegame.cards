import { useGameView, useGameOver, useNewGame } from "../hooks/game";
import { useRouter } from "next/router";
import Button from "./Button";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";

const GameOver = () => {
  const gameView = useGameView();
  const gameOver = useGameOver();
  const newGame = useNewGame();
  const router = useRouter();
  const { t } = useTranslation();

  if (!gameOver.over) {
    return null;
  }

  return (
    <div className="lg:py-6 py-4 px-2 text-center">
      <p className="lg:text-xl pb-2">
        {t("game-over", "The game is over.")}
        <br />
        {gameOver.winner && (
          <Trans i18nKey="winner-team">
            The {{ team: t(gameOver.winner + "-adj") }} team wins!
          </Trans>
        )}
        {t(gameOver.message)}
      </p>

      <Button
        className="mr-2 mb-2"
        onClick={() => {
          if (!gameView.game.nextGameId) {
            newGame(
              { ...gameView.game.options, noReuse: gameView.game.words },
              { forward: true }
            );
          } else {
            router.push("/[gameId]", `/${gameView.game.nextGameId}`);
          }
        }}
      >
        {t("new-game", "New game")}
      </Button>
      <Link href="/">
        <a>
          <Button className="mb-2" color="neutral">
            {t("back-to-lobby", "Back to lobby")}
          </Button>
        </a>
      </Link>
      <div className="mt-auto lg:block hidden leading-tight p-2">
        <a
          href="https://www.buymeacoffee.com/benjamintd"
          className="text-sm text-gray-600 hover:text-gray-400 underline mb-2"
        >
          {t("buymeacoffee", "Support the game, buy me a coffee")}
        </a>
      </div>
    </div>
  );
};

export default GameOver;
