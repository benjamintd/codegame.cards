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
    <div className="py-6 px-2 text-center">
      <p className="h2 pb-2">
        The game is over. <br />
        The {gameOver.winner} team wins!
      </p>

      <Button
        className="mr-2"
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
          <Button color="neutral">Back to lobby</Button>
        </a>
      </Link>
    </div>
  );
};