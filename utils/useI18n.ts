"use client";

import { useEffect, useMemo, useState } from "react";
import de from "@/locales/de.json";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

export type Language = "en" | "de" | "fa";

type TranslationTree = typeof en;
type TranslationKey = `${keyof TranslationTree & string}.${string}`;

const LANGUAGE_KEY = "little-learners-language";
const dictionaries: Record<Language, TranslationTree> = { en, de, fa };

function getNestedValue(dictionary: TranslationTree, key: TranslationKey) {
  return key.split(".").reduce<unknown>((value, part) => {
    if (value && typeof value === "object" && part in value) {
      return (value as Record<string, unknown>)[part];
    }
    return undefined;
  }, dictionary);
}

export function useI18n() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (storedLanguage && storedLanguage in dictionaries) {
      setLanguageState(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const value = useMemo(() => {
    const dictionary = dictionaries[language];
    return {
      dir: language === "fa" ? "rtl" as const : "ltr" as const,
      language,
      setLanguage: setLanguageState,
      t: (key: TranslationKey) => {
        const translated = getNestedValue(dictionary, key);
        return typeof translated === "string" ? translated : key;
      }
    };
  }, [language]);

  return value;
}
