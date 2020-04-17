import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import useNetwork from "../hooks/network";
import { IGame } from "../lib/game";
import useLocalStorage from "../hooks/useLocalStorage";

export default () => {
  const network = useNetwork();
  const router = useRouter();

  const [game, setGame] = useState<IGame>(null);
  const [player, setPlayer] = useLocalStorage("player", { id: uuidv4() });

  useEffect(() => {
    network.subscribeToGame(router.query.gameId as string, (game) => {
      setGame(game);
    });
  }, [network]);

  // if no player or no name, we should have an input for the name and team.
  // and a button "join red, join blue, join red as spymaster, join blue as spymaster"

  // once joined, unlock the chat
  return (
    <div>
      <div>{JSON.stringify(game)}</div>
      <div>{JSON.stringify(player)}</div>
    </div>
  );
};
