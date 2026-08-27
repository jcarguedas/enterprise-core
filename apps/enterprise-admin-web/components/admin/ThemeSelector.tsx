"use client";

import { useId } from "react";

import { useI18n } from "@/lib/i18n/use-i18n";
import { useTheme } from "@/lib/theme/use-theme";

type ThemeSelectorProps = {
  className?: string;
};

export function ThemeSelector({ className = "" }: ThemeSelectorProps) {
  const inputId = useId();
  const { messages: t } = useI18n();
  const { setTheme, theme } = useTheme();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <label htmlFor={inputId} className="app-muted text-sm font-semibold">
        {t.theme}
      </label>
      <select
        id={inputId}
        value={theme}
        onChange={(event) =>
          setTheme(event.target.value === "dark" ? "dark" : "light")
        }
        className="app-input h-10 rounded-md border px-3 text-sm font-semibold shadow-sm outline-none transition-colors"
      >
        <option value="light">{t.light}</option>
        <option value="dark">{t.dark}</option>
      </select>
    </div>
  );
}
