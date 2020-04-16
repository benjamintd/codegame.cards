import React from "react";
import { useRouter } from "next/router";
import useNetwork from "../hooks/network";

const Home = () => {
  const network = useNetwork();
  const router = useRouter();
  network.subscribeToOnGoingGames((games) => console.log(games));

  return (
    <div className="container">
      <div
        className="p-6"
        onClick={async () => {
          try {
            const { game } = await fetch("/api/new-game").then((res) =>
              res.json()
            );
            await network.updateGame(game);
            router.push("/[gameId]", `/${game.id}`);
          } catch (error) {
            console.log("error");
          }
        }}
      >
        new game
      </div>
    </div>
  );
};

export default Home;
