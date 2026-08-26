"use client";

import { CommandPalette } from "@/components/admin/CommandPalette";
import { LanguageSelector } from "@/components/admin/LanguageSelector";
import { ThemeSelector } from "@/components/admin/ThemeSelector";
import type { StoredUser } from "@/lib/auth-storage";
import { useI18n } from "@/lib/i18n/use-i18n";

type AdminHeaderProps = {
  userDisplayName: string;
  trustedUser: StoredUser | null;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function AdminHeader({
  userDisplayName,
  trustedUser,
  isLoggingOut,
  onLogout,
}: AdminHeaderProps) {
  const { messages: t } = useI18n();

  return (
    <header className="app-card flex flex-col gap-4 border-b px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div>
        <p className="app-subtle text-xs font-semibold uppercase tracking-[0.14em]">
          {t.protectedWorkspace}
        </p>
        <p className="app-text mt-1 text-sm font-medium">
          {userDisplayName}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CommandPalette trustedUser={trustedUser} />
        <LanguageSelector />
        <ThemeSelector />

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? t.signingOut : t.logout}
        </button>
      </div>
    </header>
  );
}
