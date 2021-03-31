import Button from "../components/Button";
import { IGameOptions, defaultOptions, ILanguage, IGame } from "../lib/game";
import { useCallback, useEffect, useState } from "react";
import { useNewGame } from "../hooks/game";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { useRouter } from "next/router";
import { i18n } from "../lib/i18n";
import { debounce } from "lodash";

const NewGame = () => {
  const newGame = useNewGame();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IGameOptions>({
    ...defaultOptions,
    language: (router.locale as ILanguage) || "en",
  });

  useEffect(() => {
    i18n.changeLanguage(router.locale as ILanguage);
  }, []);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center w-screen min-h-screen p-6 bg-gray-100">
      <div className="absolute top-0 right-0 m-4">
        <LanguageSelector />
      </div>
      <h1 className="mt-6 mb-4 font-mono h1">codegame.cards</h1>

      <h2 className="mt-6 mb-4 text-xl font-bold">
        {t("choose-options", "Choose your options")}
      </h2>
      <Form
        className="w-full max-w-md mb-4"
        options={options}
        setOptions={setOptions}
      />

      <Button
        className="flex items-center justify-center p-6"
        disabled={
          loading ||
          (options.onlyUseCustomWords && options.customWords.length < 25)
        }
        onClick={async () => {
          setLoading(true);
          try {
            await newGame(options);
          } catch (error) {
            setLoading(false);
          }
        }}
      >
        {t("create-game", "Create game")}
      </Button>
    </div>
  );
};

export default NewGame;

const Form = ({
  className,
  options,
  setOptions,
}: {
  className: string;
  options: IGameOptions;
  setOptions: (options: IGameOptions) => void;
}) => {
  const { t } = useTranslation();

  return (
    <form className={className}>
      <div className="w-auto mb-2">
        <h2 className="mb-2 font-semibold">{t("dictionary", "Dictionary")}</h2>
        <MultipleChoice
          options={[
            {
              label: "🇬🇧 English",
              value: "en",
            },
            {
              label: "🇫🇷 Français",
              value: "fr",
            },
            {
              label: "🇩🇪 Deutsch",
              value: "de",
            },
            {
              label: "🇪🇸 Español",
              value: "es",
            },
            {
              label: "🇷🇺 Русский",
              value: "ru",
            },
            {
              label: "🇭🇺 Magyar",
              value: "hu",
            },
            {
              label: "🇧🇷 Português",
              value: "ptbr",
            },
            {
              label: "🔥 Emoji",
              value: "emoji",
            },
          ]}
          onClick={(language) => setOptions({ ...options, language })}
          selected={options.language}
        />
      </div>
      <div className="w-auto mb-2">
        <h2 className="mb-2 font-semibold">{t("mode", "Mode")}</h2>
        <MultipleChoice
          options={[
            { value: "duet", label: `👥 ${t("duet", "Duet")}` },
            { value: "classic", label: `👨‍👩‍👧‍👦 ${t("classic", "Classic")}` },
          ]}
          onClick={(mode) => setOptions({ ...options, mode })}
          selected={options.mode}
        />
      </div>
      <div className="w-auto mb-2">
        <h2 className="mb-2 font-semibold">
          {t("public-game", "Public game")}
        </h2>
        <MultipleChoice
          options={[
            { value: "private", label: `🔒 ${t("private", "Private")}` },
            { value: "public", label: `🖖 ${t("public", "Public")}` },
          ]}
          onClick={(p) => setOptions({ ...options, private: p })}
          selected={options.private}
        />
      </div>

      <CustomWordsInput options={options} setOptions={setOptions} />
    </form>
  );
};

interface IMultipleChoice {
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  selected: string;
}

const MultipleChoice = ({ options, onClick, selected }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <div
          key={opt.value}
          className={classnames(
            "rounded px-2 py-1 cursor-pointer w-48 text-center font-bold text-white border-b-4 w-full",
            {
              "bg-green-600 border-green-800": selected === opt.value,
              "bg-blue-500 border-blue-700 hover:bg-blue-400 hover:border-blue-600":
                selected !== opt.value,
            }
          )}
          onClick={() => onClick(opt.value)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
};

const CustomWordsInput = ({
  options,
  setOptions,
}: {
  options: IGameOptions;
  setOptions: (opts: IGameOptions) => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const debouncedSetWords = useCallback(
    debounce((value: string) => {
      setOptions({
        ...options,
        customWords: value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => !!s),
      });
    }, 300),
    []
  );

  return (
    <div className="w-auto py-2">
      <button
        className="mb-2 text-blue-800 underline cursor-pointer hover:text-blue-700"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t("advanced", "advanced...")}
      </button>
      {isOpen && (
        <div>
          <h2 className="font-semibold">{t("custom-words", "Custom words")}</h2>
          <p className="mb-2 text-sm text-gray-800">
            {t(
              "custom-words-notice",
              "Enter a comma-separated list of custom words. Uncheck the box below to use those words exclusively."
            )}
          </p>
          <label className="inline-block mb-2 cursor-pointer">
            <input
              type="checkbox"
              className="-mt-1 rounded"
              checked={!options.onlyUseCustomWords}
              onChange={(e) => {
                setOptions({
                  ...options,
                  onlyUseCustomWords: !e.target.checked,
                });
              }}
            ></input>
            <span className="ml-2 text-gray-800">
              {t("custom-words-checkbox", "Merge with the dictionnary")}
            </span>
            {options.onlyUseCustomWords && options.customWords.length < 25 && (
              <p className="text-sm text-red-600">
                {t(
                  "custom-words-warning",
                  "You need at least 25 words to play with custom words only."
                )}
              </p>
            )}
          </label>

          <textarea
            onChange={(e) => debouncedSetWords(e.target.value)}
            className="block w-full rounded"
            placeholder={t(
              "custom-words-placeholder",
              "harder, better, faster, stronger"
            )}
          ></textarea>
        </div>
      )}
    </div>
  );
};
