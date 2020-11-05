import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en";
import es from "../locales/es";
import fr from "../locales/fr";
import ru from "../locales/ru";
import ptbr from "../locales/ptbr";
import de from "../locales/de";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
      fr: {
        translation: fr,
      },
      ru: {
        translation: ru,
      },
      ptbr: {
        translation: ptbr,
      },
      de: {
        translation: de,
      },
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n };
