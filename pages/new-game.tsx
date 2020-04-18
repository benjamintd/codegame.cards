import useNetwork from "../hooks/network";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { IGameOptions, defaultOptions } from "../lib/game";
import { useState } from "react";

export default () => {
  const network = useNetwork();
  const router = useRouter();
  const [options, setOptions] = useState<IGameOptions>(defaultOptions);

  return (
    // todo add options and stuff
    <div className="w-screen h-screen p-6 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl uppercase font-bold tracking-wide mb-4 mt-6">
        Codenames
      </h1>

      <h2 className="text-xl font-bold mt-6 mb-4">Chose your options</h2>
      <Form className="mb-4" options={options} setOptions={setOptions} />

      <Button
        className="p-6 flex items-center justify-center"
        onClick={async () => {
          try {
            const { game } = await fetch("/api/new-game", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(options),
            }).then((res) => res.json());
            await network.updateGame(game);
            router.push("/[gameId]", `/${game.id}`);
          } catch (error) {
            console.log("error");
          }
        }}
      >
        Create game
      </Button>
    </div>
  );
};

const Form = ({
  className,
  options,
  setOptions,
}: {
  className: string;
  options: IGameOptions;
  setOptions: (options: IGameOptions) => void;
}) => {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const name = e.currentTarget.name;
    setOptions({ ...options, [name]: e.currentTarget.value });
  }
  return (
    <form className={className}>
      <div className="mb-2 w-64 flex justify-between">
        <label htmlFor="language" className="font-bold mr-2">
          Dictionnary
        </label>
        <select
          name="language"
          id="language"
          className="border bg-white w-32"
          value={options.language}
          onChange={handleChange}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div className="mb-2 w-64 flex justify-between">
        <label htmlFor="mode" className="font-bold mr-2">
          Mode
        </label>
        <select
          name="mode"
          id="mode"
          className="border bg-white w-32"
          value={options.mode}
          onChange={handleChange}
        >
          <option value="classic">Classic</option>
          <option value="duet">Duet</option>
        </select>
      </div>
    </form>
  );
};
