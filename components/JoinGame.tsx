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

  const hasSpymaster = (team) =>
    Object.values(players).findIndex((p) => p.spymaster && p.team === team) >
    -1;

  const onClick = ({ team, spymaster }: Partial<IPlayer>) => {
    if (name) {
      setLocalStoragePlayer({
        name,
        id: selfId,
      });
      addPlayer({
        name,
        id: selfId,
        team,
        spymaster,
        clickedOn: -1,
        host: Object.keys(players).length === 0 ? true : false,
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
          "border-red-400": warnInput,
        })}
        placeholder="Enter player name"
        value={name}
        onChange={onChange}
      />

      {gameMode === "classic" ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Button
            color="red"
            onClick={() => onClick({ team: "red", spymaster: false })}
          >
            join red
          </Button>
          <Button
            color="dark-red"
            onClick={() => onClick({ team: "red", spymaster: true })}
            disabled={hasSpymaster("red")}
          >
            join red as spymastter
          </Button>
          <Button
            color="blue"
            onClick={() => onClick({ team: "blue", spymaster: false })}
          >
            join blue{" "}
          </Button>
          <Button
            color="dark-blue"
            onClick={() => onClick({ team: "blue", spymaster: true })}
            disabled={hasSpymaster("blue")}
          >
            join blue as spymaster
          </Button>
        </div>
      ) : (
        <div>
          {/* todo handle duet mode */}
          <Button>join game</Button>
        </div>
      )}
    </div>
  );
};

export default JoinGame;
