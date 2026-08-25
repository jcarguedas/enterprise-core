"use client";

import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { hasPermission, MANAGE_USERS_PERMISSION } from "@/lib/permissions";
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
  const accountName = trustedUser?.name ?? "Unavailable";
  const accountEmail = trustedUser?.email ?? "Unavailable";
  const canManageUsers = hasPermission(trustedUser, MANAGE_USERS_PERMISSION);

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      trustedUser={trustedUser}
      isLoggingOut={isLoggingOut}
      onLogout={logout}
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow={t.productName}
          title={t.dashboard}
          description="Protected admin workspace for Enterprise Core operations."
        >
          <p className="mt-4 text-lg font-medium text-[#1f3a5f]">
            {status === "ready"
              ? `Welcome, ${welcomeName}.`
              : t.validatingSession}
          </p>
        </PageHeader>

        {status === "error" ? (
          <StatusMessage variant="error" className="mt-6">
            {errorMessage}
          </StatusMessage>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-[#0f172a]">
                Account Summary
              </h2>
              <span className="inline-flex shrink-0 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-1 text-xs font-semibold text-[#166534]">
                Signed in
              </span>
            </div>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs font-semibold uppercase text-[#64748b]">
                  Name
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[#0f172a]">
                  {accountName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-[#64748b]">
                  Email
                </dt>
                <dd className="mt-1 break-all text-sm font-medium text-[#475569]">
                  {accountEmail}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-[#0f172a]">
                Session Security
              </h2>
              <span className="inline-flex shrink-0 rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
                Authenticated
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#475569]">
              This workspace validates your stored session with the Enterprise
              Auth Service before protected admin content is shown.
            </p>
          </section>

          {canManageUsers ? (
            <section className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-[#0f172a]">
                  User Management
                </h2>
                <span className="inline-flex shrink-0 rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
                  Ready
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#475569]">
                Review enterprise users, manage account status, and maintain
                role assignments from the Users workspace.
              </p>
              <Link
                href="/users"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#172033] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#24324d] focus:outline-none focus:ring-2 focus:ring-[#172033] focus:ring-offset-2"
              >
                Manage users
              </Link>
            </section>
          ) : (
            <section className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-[#0f172a]">
                  {t.userManagementUnavailable}
                </h2>
                <span className="inline-flex shrink-0 rounded-md border border-[#fde68a] bg-[#fffbeb] px-2 py-1 text-xs font-semibold text-[#92400e]">
                  Restricted
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#475569]">
                {t.userManagementUnavailableDescription}
              </p>
            </section>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
