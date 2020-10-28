import { useRouter } from "next/router";
import React from "react";


const Languages = {
  en: "English",
  fr: "Français",
  es: "Español",
  ru: "русский",
  ptbr: "Brasileiro",
};

export default function LanguageSelector() {
  const router = useRouter();

  return (
    <label htmlFor="lang">
      <span className="sr-only">Choose a language</span>
      <select
        className="form-select bg-transparent"
        value={router.locale}
        onChange={e => {
          router.push(router.pathname, router.asPath, { locale: e.target.value });
        }}
      >
        {Object.keys(Languages).map(value => (
          <option key={value} value={value}>
            {Languages[value]}
          </option>
        ))}
      </select>
    </label>
  );
}

