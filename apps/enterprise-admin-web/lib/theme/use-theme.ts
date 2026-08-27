"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export const SUPPORTED_THEMES = ["light", "dark"] as const;
export const DEFAULT_THEME = "light";
export const THEME_STORAGE_KEY = "enterprise_core_theme";

const THEME_STORAGE_EVENT = "enterprise-core-theme-storage";

export type SupportedTheme = (typeof SUPPORTED_THEMES)[number];

function isBrowser() {
  return typeof window !== "undefined";
}

function isSupportedTheme(value: string | null): value is SupportedTheme {
  return SUPPORTED_THEMES.some((theme) => theme === value);
}

function getThemeSnapshot(): SupportedTheme {
  if (!isBrowser()) {
    return DEFAULT_THEME;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isSupportedTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
}

function subscribeToTheme(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_STORAGE_EVENT, onStoreChange);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((nextTheme: SupportedTheme) => {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_STORAGE_EVENT));
  }, []);

  return {
    setTheme,
    supportedThemes: SUPPORTED_THEMES,
    theme,
  };
}
