"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { useI18n } from "@/lib/i18n/use-i18n";
import { productDisplayName } from "@/lib/product-info";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";

export default function SettingsPage() {
  const { messages: t } = useI18n();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();

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
          title={t.settings}
          description={t.settingsDescription}
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
            <StatusMessage variant="info" className="mt-6">
              {t.settingsInformationalNotice}
            </StatusMessage>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <SummaryCard
                title={t.workspacePreferences}
                status={t.future}
                description={t.workspacePreferencesDescription}
              />
              <SummaryCard
                title={t.localizationSettings}
                status={t.browserRuntime}
                description={t.localizationSettingsDescription}
              />
              <SummaryCard
                title={t.appearanceSettings}
                status={t.browserRuntime}
                description={t.appearanceSettingsDescription}
              />
              <SummaryCard
                title={t.securitySettings}
                status={t.future}
                description={t.securitySettingsDescription}
              />
            </div>
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}
