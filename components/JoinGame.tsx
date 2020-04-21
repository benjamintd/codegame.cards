import {
  usePlayers,
  useGameMode,
  useSelfId,
  useAddPlayer,
} from "../hooks/game";
import { useState } from "react";
import { IPlayer } from "../lib/game";
import Button from "./Button";
import classnames from "classnames";
import useLocalStorage from "../hooks/useLocalStorage";

const JoinGame = () => {
  const [localStoragePlayer, setLocalStoragePlayer] = useLocalStorage(
    "player",
    null
  );
  const players = usePlayers();
  const gameMode = useGameMode();
  const selfId = useSelfId();
  const addPlayer = useAddPlayer();

  const [name, setName] = useState<string>(localStoragePlayer?.name || "");
  const [warnInput, setWarnInput] = useState<boolean>(false);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const onClick = ({ team }: Partial<IPlayer>) => {
    if (name) {
      setLocalStoragePlayer({
        name,
        id: selfId,
      });
      addPlayer({
        name,
        id: selfId,
        team,
        spymaster: false,
        clickedOn: -1,
      });
    } else {
      setWarnInput(true);
    }
  };

  return (
    <div className="w-full flex flex-col p-2">
      <h2 className="h2 text-center pb-2">Join game</h2>
      <input
        type="text"
        className={classnames("text-input mb-2", {
          "border-red-400 shadow-red": warnInput,
        })}
        placeholder="Enter player name"
        value={name}
        onChange={onChange}
      />

      {gameMode === "classic" ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Button color="red" onClick={() => onClick({ team: "red" })}>
            join red
          </Button>
          <Button color="blue" onClick={() => onClick({ team: "blue" })}>
            join blue
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Button
            color="dark-blue"
            onClick={() => onClick({ team: "duetA", spymaster: true })}
          >
            join side A
          </Button>
          <Button
            color="blue"
            onClick={() => onClick({ team: "duetB", spymaster: true })}
          >
            join side B
          </Button>
        </div>
      )}
      <style jsx>{`
        .shadow-red {
          box-shadow: 0px 0px 8px 0px rgba(254, 178, 178, 1);
        }
      `}</style>
    </div>
  );
};

export default JoinGame;
