"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { translations, defaultLang, supportedLangs } from "./index";

const I18nContext = createContext(null);

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    // Safari private mode + some embedded webviews throw on
    // localStorage access. Wrap all reads/writes in try/catch so
    // the language preference fails open (default lang) instead
    // of crashing the entire provider tree.
    try {
      const stored = localStorage.getItem("fronnexus_lang");
      if (stored && supportedLangs.includes(stored)) {
        setLang(stored);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = stored;
        }
      }
    } catch {
      // localStorage unavailable — silent fallback to default lang
    }
  }, []);

  const changeLang = useCallback((code) => {
    if (!supportedLangs.includes(code)) return;
    setLang(code);
    try {
      localStorage.setItem("fronnexus_lang", code);
    } catch {
      // session-only persistence still works (state stays); future
      // visits will revert to default — acceptable degradation
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
    }
  }, []);

  const t = useCallback(
    (key) => {
      const value = getNestedValue(translations[lang], key);
      if (value !== undefined) return value;
      const fallback = getNestedValue(translations[defaultLang], key);
      return fallback !== undefined ? fallback : key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, changeLang, t, supportedLangs }), [lang, changeLang, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
