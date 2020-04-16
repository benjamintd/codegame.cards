import React, { useEffect } from "react";
import newGame from "../lib/newGame";
import { IGame } from "../lib/game";
import useNetwork from "../hooks/network";

export default function Home({ game }: { game: IGame }) {
  const network = useNetwork();

  network.subscribeToOnGoingGames((games) => console.log(games));
  console.log(game);
  return (
    <div className="container">
      <div className="font-bold">{JSON.stringify(game)}</div>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: { game: newGame() } };
}
