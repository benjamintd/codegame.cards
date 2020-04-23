import { useGameView, useGameOver, useNewGame } from "../hooks/game";
import { useRouter } from "next/router";
import Button from "./Button";
import Link from "next/link";

export default () => {
  const gameView = useGameView();
  const gameOver = useGameOver();
  const newGame = useNewGame();
  const router = useRouter();

  if (!gameOver.over) {
    return null;
  }

  return (
    <div className="lg:py-6 py-4 px-2 text-center">
      <p className="lg:text-xl text-lg pb-2">
        The game is over. <br />
        {gameOver.winner && `The ${gameOver.winner} team wins!`}
        {gameOver.message}
      </p>

      <Button
        className="mr-2 mb-2"
        onClick={() => {
          if (!gameView.game.nextGameId) {
            newGame(gameView.game.options, { forward: true });
          } else {
            router.push("/[gameId]", `/${gameView.game.nextGameId}`);
          }
        }}
      >
        New game
      </Button>
      <Link href="/">
        <a>
          <Button className="mb-2" color="neutral">
            Back to lobby
          </Button>
        </a>
      </Link>
    </div>
  );
};
