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
      <label htmlFor={inputId} className="text-sm font-semibold text-[#334155]">
        {t.language}
      </label>
      <select
        id={inputId}
        value={locale}
        onChange={(event) =>
          setLocale(event.target.value === "es" ? "es" : "en")
        }
        className="h-10 rounded-md border border-[#b8c2d2] bg-white px-3 text-sm font-semibold text-[#172033] shadow-sm outline-none transition-colors focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15"
      >
        <option value="en">EN - {t.english}</option>
        <option value="es">ES - {t.spanish}</option>
      </select>
    </div>
  );
}
