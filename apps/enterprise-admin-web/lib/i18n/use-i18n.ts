"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/lib/i18n/config";
import type { SupportedLanguage } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";

export const LOCALE_STORAGE_KEY = "enterprise_core_locale";
const LOCALE_STORAGE_EVENT = "enterprise-core-locale-storage";

function isBrowser() {
  return typeof window !== "undefined";
}

export function isSupportedLanguage(
  value: string | null,
): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((language) => language === value);
}

function getLocaleSnapshot(): SupportedLanguage {
  if (!isBrowser()) {
    return DEFAULT_LANGUAGE;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  return isSupportedLanguage(storedLocale) ? storedLocale : DEFAULT_LANGUAGE;
}

function subscribeToLocale(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOCALE_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOCALE_STORAGE_EVENT, onStoreChange);
  };
}

export function useI18n() {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    () => DEFAULT_LANGUAGE,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: SupportedLanguage) => {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    window.dispatchEvent(new Event(LOCALE_STORAGE_EVENT));
  }, []);

  return {
    locale,
    messages: messages[locale],
    setLocale,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
