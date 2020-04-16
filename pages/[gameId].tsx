import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useNetwork from "../hooks/network";
import { IGame } from "../lib/game";

export default () => {
  const network = useNetwork();
  const router = useRouter();
  console.log(router.query);
  const [game, setGame] = useState<IGame>(null);

  useEffect(() => {
    network.subscribeToGame(router.query.gameId as string, (game) => {
      setGame(game);
    });
  }, []);

  return <div>{JSON.stringify(game)}</div>;
};
