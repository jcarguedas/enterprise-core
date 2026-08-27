"use client";

import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { useI18n } from "@/lib/i18n/use-i18n";
import { hasPermission, MANAGE_USERS_PERMISSION } from "@/lib/permissions";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";

export default function DashboardPage() {
  const { messages: t } = useI18n();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();

  const welcomeName =
    trustedUser?.name || trustedUser?.email || t.administratorFallback;
  const accountName = trustedUser?.name ?? t.unavailable;
  const accountEmail = trustedUser?.email ?? t.unavailable;
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
          description={t.dashboardDescription}
        >
          <p className="app-muted mt-4 text-lg font-medium">
            {status === "ready"
              ? t.dashboardWelcome.replace("{name}", welcomeName)
              : t.validatingSession}
          </p>
        </PageHeader>

        {status === "error" ? (
          <StatusMessage variant="error" className="mt-6">
            {errorMessage}
          </StatusMessage>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="app-card rounded-lg border p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="app-text text-base font-semibold">
                {t.accountSummary}
              </h2>
              <span className="app-badge-success inline-flex shrink-0 rounded-md border px-2 py-1 text-xs font-semibold">
                {t.signedIn}
              </span>
            </div>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="app-subtle text-xs font-semibold uppercase">
                  {t.name}
                </dt>
                <dd className="app-text mt-1 text-sm font-semibold">
                  {accountName}
                </dd>
              </div>
              <div>
                <dt className="app-subtle text-xs font-semibold uppercase">
                  {t.email}
                </dt>
                <dd className="app-muted mt-1 break-all text-sm font-medium">
                  {accountEmail}
                </dd>
              </div>
            </dl>
          </section>

          <section className="app-card rounded-lg border p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="app-text text-base font-semibold">
                {t.sessionSecurity}
              </h2>
              <span className="app-badge-neutral inline-flex shrink-0 rounded-md border px-2 py-1 text-xs font-semibold">
                {t.authenticated}
              </span>
            </div>
            <p className="app-muted mt-4 text-sm leading-6">
              {t.sessionSecurityDescription}
            </p>
          </section>

          {canManageUsers ? (
            <section className="app-card rounded-lg border p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="app-text text-base font-semibold">
                  {t.userManagement}
                </h2>
                <span className="app-badge-neutral inline-flex shrink-0 rounded-md border px-2 py-1 text-xs font-semibold">
                  {t.ready}
                </span>
              </div>
              <p className="app-muted mt-4 text-sm leading-6">
                {t.userManagementDescription}
              </p>
              <Link
                href="/users"
                className="app-button-primary mt-5 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
              >
                {t.manageUsers}
              </Link>
            </section>
          ) : (
            <section className="app-card rounded-lg border p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="app-text text-base font-semibold">
                  {t.userManagementUnavailable}
                </h2>
                <span className="app-badge-warning inline-flex shrink-0 rounded-md border px-2 py-1 text-xs font-semibold">
                  {t.restricted}
                </span>
              </div>
              <p className="app-muted mt-4 text-sm leading-6">
                {t.userManagementUnavailableDescription}
              </p>
            </section>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
