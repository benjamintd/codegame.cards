import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useLocalStorage from "../hooks/useLocalStorage";

const Languages = {
  en: "EN",
  fr: "FR",
  ru: "RU",
};

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage("lang", i18n.language);
  const [i18nInitialized, setI18nInitialized] = useState<number>(0);

  useEffect(() => {
    const setInitialized = () => setI18nInitialized(i18nInitialized + 1);
    i18n.on("initialized", () => {
      setInitialized();
    });
  }, []);

  useEffect(() => {
    if (!lang) return;

    i18n.changeLanguage(lang);
  }, [lang, i18nInitialized]);

  return (
    <label htmlFor="lang">
      <span className="sr-only">Choose a language</span>
      <select
        id="lang"
        className=""
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        {Object.keys(Languages).map((value) => (
          <option key={value} value={value}>
            {Languages[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
