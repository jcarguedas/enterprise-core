"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n/use-i18n";

type AccessDeniedStateProps = {
  title: string;
  description: string;
  showDashboardLink?: boolean;
};

export function AccessDeniedState({
  title,
  description,
  showDashboardLink = true,
}: AccessDeniedStateProps) {
  const { messages: t } = useI18n();

  return (
    <section className="app-card mt-6 rounded-lg border p-5">
      <div className="max-w-2xl">
        <span className="app-badge-warning inline-flex rounded-md border px-2 py-1 text-xs font-semibold">
          {t.restricted}
        </span>
        <h2 className="app-text mt-4 text-base font-semibold">
          {title}
        </h2>
        <p className="app-muted mt-2 text-sm leading-6">{description}</p>
        {showDashboardLink ? (
          <Link
            href="/dashboard"
            className="app-button-secondary mt-5 inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
          >
            {t.backToDashboard}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
