"use client";

import { useId } from "react";

import { useI18n } from "@/lib/i18n/use-i18n";

type LanguageSelectorProps = {
  className?: string;
};

export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const inputId = useId();
  const { locale, messages: t, setLocale } = useI18n();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <label htmlFor={inputId} className="app-muted text-sm font-semibold">
        {t.language}
      </label>
      <select
        id={inputId}
        value={locale}
        onChange={(event) =>
          setLocale(event.target.value === "es" ? "es" : "en")
        }
        className="app-input h-10 rounded-md border px-3 text-sm font-semibold shadow-sm outline-none transition-colors"
      >
        <option value="en">EN - {t.english}</option>
        <option value="es">ES - {t.spanish}</option>
      </select>
    </div>
  );
}
