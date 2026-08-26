"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { apiConfig } from "@/lib/api-config";
import { useI18n } from "@/lib/i18n/use-i18n";
import { productDisplayName, productVersion } from "@/lib/product-info";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";

type SystemInfoItem = {
  label: string;
  value: string;
};

export default function SystemPage() {
  const { messages: t } = useI18n();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();
  const systemInfoItems: SystemInfoItem[] = [
    {
      label: t.productDisplayNameLabel,
      value: productDisplayName,
    },
    {
      label: t.productVersionLabel,
      value: productVersion,
    },
    {
      label: t.adminApp,
      value: t.adminWeb,
    },
    {
      label: t.apiBaseUrl,
      value: apiConfig.baseUrl,
    },
    {
      label: t.authenticationProvider,
      value: t.enterpriseAuthService,
    },
    {
      label: t.updateMode,
      value: t.manualUpdatesFutureNetworkPlanned,
    },
    {
      label: t.deploymentModel,
      value: t.localFirstDirection,
    },
  ];

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
          title={t.system}
          description={t.systemDescription}
          rightBadge={t.protected}
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

        {status === "ready" ? (
          <>
            <section className="app-card mt-6 rounded-lg border">
              <div className="app-divider border-b px-5 py-4">
                <h2 className="app-text text-base font-semibold">
                  {t.systemInformation}
                </h2>
                <p className="app-subtle mt-1 text-sm">
                  {t.systemInformationDescription}
                </p>
              </div>

              <dl className="divide-y divide-[var(--app-border)]">
                {systemInfoItems.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[14rem_1fr]"
                  >
                    <dt className="app-subtle text-xs font-semibold uppercase">
                      {item.label}
                    </dt>
                    <dd className="app-text break-words text-sm font-medium">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <SummaryCard
                title={t.releaseInformation}
                status={productVersion}
                description={t.releaseInformationDescription}
              />
              <SummaryCard
                title={t.updateMode}
                status={t.updateStrategyStatus}
                description={t.updateStrategyDescription}
              />
            </div>
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}
