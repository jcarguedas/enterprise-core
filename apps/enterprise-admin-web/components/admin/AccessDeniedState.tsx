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
    <section className="mt-6 rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
      <div className="max-w-2xl">
        <span className="inline-flex rounded-md border border-[#fde68a] bg-[#fffbeb] px-2 py-1 text-xs font-semibold text-[#92400e]">
          {t.restricted}
        </span>
        <h2 className="mt-4 text-base font-semibold text-[#0f172a]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#475569]">{description}</p>
        {showDashboardLink ? (
          <Link
            href="/dashboard"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-4 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
          >
            {t.backToDashboard}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
