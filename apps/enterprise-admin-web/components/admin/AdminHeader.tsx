"use client";

import { LanguageSelector } from "@/components/admin/LanguageSelector";
import { useI18n } from "@/lib/i18n/use-i18n";

type AdminHeaderProps = {
  userDisplayName: string;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function AdminHeader({
  userDisplayName,
  isLoggingOut,
  onLogout,
}: AdminHeaderProps) {
  const { messages: t } = useI18n();

  return (
    <header className="flex flex-col gap-4 border-b border-[#d8dee8] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
          {t.protectedWorkspace}
        </p>
        <p className="mt-1 text-sm font-medium text-[#172033]">
          {userDisplayName}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LanguageSelector />

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-4 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#d8dee8] disabled:text-[#64748b]"
        >
          {isLoggingOut ? t.signingOut : t.logout}
        </button>
      </div>
    </header>
  );
}
