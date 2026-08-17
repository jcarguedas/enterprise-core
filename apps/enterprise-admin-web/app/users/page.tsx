"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";

const usersCards = [
  {
    title: "User Directory",
    description:
      "Prepare the protected directory for reviewing enterprise accounts and identity details.",
  },
  {
    title: "Role Assignments",
    description:
      "Establish the workspace for assigning roles and checking permission coverage.",
  },
  {
    title: "Access Status",
    description:
      "Track account readiness, access posture, and administrative follow-up needs.",
  },
];

export default function UsersPage() {
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    userDisplayName,
  } = useProtectedAdminSession();

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      isLoggingOut={isLoggingOut}
      onLogout={logout}
    >
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-[#d8dee8] pb-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex w-fit rounded-md border border-[#c9d3e2] bg-white px-3 py-1 text-sm font-medium text-[#334155] shadow-sm">
              {t.productName}
            </p>
            <span className="inline-flex w-fit rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
              Coming next
            </span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-[#0f172a] sm:text-4xl">
            Users
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#475569] sm:text-base">
            Manage enterprise users, access, and account readiness.
          </p>
        </div>

        {status === "checking" ? (
          <p className="mt-6 text-sm font-medium text-[#475569]">
            {t.validatingSession}
          </p>
        ) : null}

        {status === "error" ? (
          <div
            aria-live="polite"
            className="mt-6 rounded-md border border-[#f1b8b8] bg-[#fff5f5] px-4 py-3 text-sm leading-6 text-[#9b2c2c]"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {usersCards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]"
            >
              <h2 className="text-base font-semibold text-[#0f172a]">
                {card.title}
              </h2>
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
