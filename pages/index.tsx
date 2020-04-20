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
  const [seeMore, setSeeMore] = useState<boolean>(false);
  network.getPublicGames((games) => {
    setGames(games);
  });

  return (
    <div className="w-screen h-min-screen p-6 flex flex-col items-center bg-gray-100">
      <h1 className="h1 font-mono mt-6 mb-4">codenames.cards</h1>
      <Link href="/new-game">
        <Button>Create game</Button>
      </Link>

      <h2 className="h2 mt-6 mb-4">Join a room</h2>
      <div className="grid grid-flow-row grid-cols-1 gap-2">
        {games.length === 0 && (
          <p className="text-gray-700">
            There are currently no public games. Create one and invite friends!
          </p>
        )}
        {games.map((g) => (
          <LobbyGameRow game={g} />
        ))}
      </div>
      <h2 className="h2 mt-6 mb-4 text-center">How to play</h2>
      <div className="max-w-2xl leading-relaxed border rounded bg-white shadow p-6 text-gray-900">
        <p>
          Codenames is a game of guessing where teams compete to find words
          related to a hint-word given by another player.
        </p>
        <img className="p-6" src="/illustration.svg" />
        {!seeMore && (
          <p
            onClick={() => setSeeMore(true)}
            className="cursor-pointer underline text-blue-800 hover:text-blue-700"
          >
            See more...
          </p>
        )}
        {seeMore && (
          <>
            <p>
              Players split into two teams:{" "}
              <span className="text-red-700 font-bold">red</span> and{" "}
              <span className="text-blue-700 font-bold">blue</span>. One player
              of each team is selected as the team's spymaster 🕵️‍♂️ - the others
              are field operatives.
            </p>
            <p>
              Twenty-five word cards are randomly laid out in a grid. A number
              of these words represent{" "}
              <span className="text-red-700 font-bold">red</span> agents, a
              number represent{" "}
              <span className="text-blue-700 font-bold">blue</span> agents, one
              represents an{" "}
              <span className="text-black font-bold">assassin</span>, and the
              others represent{" "}
              <span className="text-yellow-600 font-bold">
                innocent bystanders
              </span>
              . The teams' spymasters know the colors of each word, and take
              turns to hint their team for them to find the words of their
              color.
            </p>
            <p>
              Each hint may only consist of one single word and a number of
              cards it relates to. The spymaster gives a hint that is related to
              as many of the words on his/her own agents' cards as possible, but
              not to any others – they might accidentally lead their team to
              choose a card representing an innocent bystander, an opposing
              agent, or the assassin.
            </p>
            <p>
              The hint's word can be chosen freely, as long as it is not (and
              does not contain) any of the words on the code name cards still
              showing at that time. Phonetic clues are typically forbidden.
            </p>
            <p>
              The cards are revealed as guesses are made. Field operatives must
              make at least one guess per turn, risking a wrong guess and its
              consequences. They may also end their turn voluntarily at any
              point thereafter. They can guess up to the number givn by the
              spymaster, plus one (a bonus to find a previously hinted word).
            </p>
            <p>
              The game ends when all of one team's agents are identified (🏅),
              or when one team has identified the{" "}
              <span className="text-black font-bold">assassin</span> (☠️).
            </p>
          </>
        )}
      </div>
      <style jsx>{`
        p {
          padding: 0.5rem 0 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
