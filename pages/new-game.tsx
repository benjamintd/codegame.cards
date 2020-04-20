import Button from "../components/Button";
import { IGameOptions, defaultOptions } from "../lib/game";
import { useState } from "react";
import { useNewGame } from "../hooks/game";

export default () => {
  const newGame = useNewGame();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IGameOptions>(defaultOptions);

  return (
    // todo add options and stuff
    <div className="w-screen h-screen p-6 flex flex-col items-center bg-gray-100">
      <h1 className="h1 font-mono mt-6 mb-4">codenames.cards</h1>

      <h2 className="text-xl font-bold mt-6 mb-4">Chose your options</h2>
      <Form className="mb-4" options={options} setOptions={setOptions} />

      <Button
        className="p-6 flex items-center justify-center"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await newGame(options);
          } catch (error) {
            setLoading(false);
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
          {/* <option value="duet">Duet</option> */}
        </select>
      </div>
      <p className="italic">duet mode is coming soon!</p>
    </form>
  );
};
