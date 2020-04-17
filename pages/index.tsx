import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useNetwork from "../hooks/network";
import { IGame } from "../lib/game";
import LobbyGameRow from "../components/LobbyGameRow";
import Button from "../components/Button";

const Home = () => {
  const network = useNetwork();
  const [games, setGames] = useState<IGame[]>([]);
  network.getPublicGames((games) => {
    setGames(games);
  });

  return (
    <div className="w-screen h-screen p-6 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl uppercase font-bold tracking-wide mb-4 mt-6">
        Codenames
      </h1>
      <Link href="/new-game">
        <Button>Create game</Button>
      </Link>

      <h2 className="text-xl font-bold mt-6 mb-4">Join a room</h2>
      <div className="grid grid-flow-row grid-cols-1 gap-2">
        {games.map((g) => (
          <LobbyGameRow game={g} />
        ))}
      </div>
    </div>
  );
};

export default Home;
