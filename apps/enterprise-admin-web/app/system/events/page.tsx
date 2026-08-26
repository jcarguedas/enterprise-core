"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { AccessDeniedState } from "@/components/admin/AccessDeniedState";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { clearStoredAuth } from "@/lib/auth-storage";
import { useI18n } from "@/lib/i18n/use-i18n";
import { INACTIVE_ACCOUNT_LOGIN_PATH } from "@/lib/inactive-account";
import {
  hasPermission,
  VIEW_SYSTEM_EVENTS_PERMISSION,
} from "@/lib/permissions";
import { productDisplayName } from "@/lib/product-info";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";
import { useSystemEvents } from "@/lib/use-system-events";
import type { SystemEvent } from "@/lib/system-events-api";

function formatEventDate(value: string | null, locale: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatActor(event: SystemEvent, unavailable: string) {
  if (event.actor_email) {
    return event.actor_email;
  }

  if (event.actor_user_id !== null) {
    return `#${event.actor_user_id}`;
  }

  return unavailable;
}

function formatTarget(event: SystemEvent, unavailable: string) {
  if (event.target_type && event.target_id) {
    return `${event.target_type} #${event.target_id}`;
  }

  if (event.target_type) {
    return event.target_type;
  }

  if (event.target_id) {
    return `#${event.target_id}`;
  }

  return unavailable;
}

function severityClass(severity: string) {
  const normalizedSeverity = severity.toLowerCase();

  if (normalizedSeverity === "warning") {
    return "app-badge-warning";
  }

  if (normalizedSeverity === "error") {
    return "app-status-error";
  }

  return "app-badge-neutral";
}

export default function SystemEventsPage() {
  const router = useRouter();
  const { locale, messages: t } = useI18n();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();
  const canViewSystemEvents = hasPermission(
    trustedUser,
    VIEW_SYSTEM_EVENTS_PERMISSION,
  );
  const handleUnauthorized = useCallback(() => {
    clearStoredAuth();
    router.replace("/login");
  }, [router]);
  const handleInactiveAccount = useCallback(() => {
    clearStoredAuth();
    router.replace(INACTIVE_ACCOUNT_LOGIN_PATH);
  }, [router]);
  const systemEvents = useSystemEvents({
    onInactiveAccount: handleInactiveAccount,
    onUnauthorized: handleUnauthorized,
  });
  const {
    errorMessage: systemEventsErrorMessage,
    events,
    isRefreshing,
    loadEvents,
    refreshEvents,
    status: systemEventsStatus,
  } = systemEvents;
  const isAccessDenied =
    (status === "ready" && !canViewSystemEvents) ||
    systemEventsStatus === "access_denied";

  useEffect(() => {
    if (status !== "ready" || !canViewSystemEvents) {
      return;
    }

    let isCurrent = true;

    Promise.resolve().then(() => {
      if (!isCurrent) {
        return;
      }

      loadEvents({ shouldApplyResult: () => isCurrent });
    });

    return () => {
      isCurrent = false;
    };
  }, [canViewSystemEvents, loadEvents, status]);

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      trustedUser={trustedUser}
      isLoggingOut={isLoggingOut}
      onLogout={logout}
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow={productDisplayName}
          title={t.systemEvents}
          description={t.systemEventsDescription}
          rightBadge={t.systemEventsReadOnlyStatus}
        />

        {status === "checking" ? (
          <StatusMessage variant="info" className="mt-6">
            {t.validatingSession}
          </StatusMessage>
        ) : null}

        {status === "error" ? (
          <StatusMessage variant="error" className="mt-6">
            {errorMessage}
          </StatusMessage>
        ) : null}

        {isAccessDenied ? (
          <AccessDeniedState
            title={t.systemEventsAccessDenied}
            description={t.systemEventsAccessDeniedDescription}
          />
        ) : null}

        {!isAccessDenied && status === "ready" ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SummaryCard
                title={t.systemEvents}
                status={events.length.toString()}
                description={t.systemEventsSummaryDescription}
              />
              <SummaryCard
                title={t.permissions}
                status={VIEW_SYSTEM_EVENTS_PERMISSION}
                description={t.systemEventsPermissionDescription}
              />
            </div>

            <section className="app-card mt-6 rounded-lg border">
              <div className="app-divider flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="app-text text-base font-semibold">
                    {t.systemEvents}
                  </h2>
                  <p className="app-subtle mt-1 text-sm">
                    {t.systemEventsDescription}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshEvents}
                  disabled={systemEventsStatus === "loading" || isRefreshing}
                  className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isRefreshing ? t.refreshingEvents : t.refreshEvents}
                </button>
              </div>

              {systemEventsStatus === "loading" ? (
                <StatusMessage variant="info" className="px-5 py-5">
                  {isRefreshing ? t.refreshingEvents : t.loadingSystemEvents}
                </StatusMessage>
              ) : null}

              {systemEventsStatus === "error" ? (
                <StatusMessage variant="error" className="m-5">
                  {systemEventsErrorMessage}
                </StatusMessage>
              ) : null}

              {systemEventsStatus === "ready" && events.length === 0 ? (
                <p className="app-muted px-5 py-8 text-center text-sm">
                  {t.noSystemEventsFound}
                </p>
              ) : null}

              {systemEventsStatus === "ready" && events.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--app-border)] text-left text-sm">
                    <thead className="app-table-head">
                      <tr>
                        <th className="app-subtle px-5 py-3 text-xs font-semibold uppercase">
                          {t.dateTime}
                        </th>
                        <th className="app-subtle px-5 py-3 text-xs font-semibold uppercase">
                          {t.severity}
                        </th>
                        <th className="app-subtle px-5 py-3 text-xs font-semibold uppercase">
                          {t.eventType}
                        </th>
                        <th className="app-subtle px-5 py-3 text-xs font-semibold uppercase">
                          {t.actor}
                        </th>
                        <th className="app-subtle px-5 py-3 text-xs font-semibold uppercase">
                          {t.message}
                        </th>
                        <th className="app-subtle px-5 py-3 text-xs font-semibold uppercase">
                          {t.target}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)]">
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="app-text whitespace-nowrap px-5 py-4 font-medium">
                            {formatEventDate(event.created_at, locale) ||
                              t.unavailable}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${severityClass(
                                event.severity,
                              )}`}
                            >
                              {event.severity}
                            </span>
                          </td>
                          <td className="app-text whitespace-nowrap px-5 py-4 font-mono text-xs">
                            {event.event_type}
                          </td>
                          <td className="app-muted whitespace-nowrap px-5 py-4">
                            {formatActor(event, t.unavailable)}
                          </td>
                          <td className="app-muted min-w-56 px-5 py-4">
                            {event.message || t.unavailable}
                          </td>
                          <td className="app-muted whitespace-nowrap px-5 py-4">
                            {formatTarget(event, t.unavailable)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}
