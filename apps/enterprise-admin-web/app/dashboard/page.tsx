"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";

export default function DashboardPage() {
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();

  const welcomeName = trustedUser?.name || trustedUser?.email || "administrator";
  const dashboardCards = [
    {
      title: "User Management",
      description:
        "Manage enterprise-controlled user access, account visibility, and operational readiness.",
      status: "Ready",
    },
    {
      title: "Roles & Permissions",
      description:
        "Review role structures and permission boundaries for protected administrative actions.",
      status: "Available",
    },
    {
      title: "Enterprise Modules",
      description:
        "Track upcoming modules that will extend the Enterprise Core operations platform.",
      status: "Planned",
    },
  ];

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      isLoggingOut={isLoggingOut}
      onLogout={logout}
    >
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-[#d8dee8] pb-6">
          <p className="mb-4 inline-flex rounded-md border border-[#c9d3e2] bg-white px-3 py-1 text-sm font-medium text-[#334155] shadow-sm">
            {t.productName}
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-[#0f172a] sm:text-4xl">
            {t.dashboard}
          </h1>
          <p className="mt-4 text-lg font-medium text-[#1f3a5f]">
            {status === "ready"
              ? `Welcome, ${welcomeName}.`
              : t.validatingSession}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#475569] sm:text-base">
            Protected admin workspace for Enterprise Core operations.
          </p>
        </div>

        {status === "error" ? (
          <div
            aria-live="polite"
            className="mt-6 rounded-md border border-[#f1b8b8] bg-[#fff5f5] px-4 py-3 text-sm leading-6 text-[#9b2c2c]"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {dashboardCards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-[#0f172a]">
                  {card.title}
                </h2>
                <span className="inline-flex shrink-0 rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
                  {card.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#475569]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
