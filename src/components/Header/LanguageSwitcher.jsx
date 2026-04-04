"use client";

import { useI18n } from "../../i18n/I18nContext";

const LANG_LABELS = {
  en: "EN",
  pt: "PT",
  es: "ES",
};

export default function LanguageSwitcher() {
  const { lang, changeLang, supportedLangs } = useI18n();

  return (
    <div className="lang-switcher">
      {supportedLangs.map((code) => (
        <button
          key={code}
          onClick={() => changeLang(code)}
          className={`lang-switcher__btn ${lang === code ? "lang-switcher__btn--active" : ""}`}
          aria-label={`Switch to ${LANG_LABELS[code]}`}
          aria-current={lang === code ? "true" : undefined}
        >
          {LANG_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
