"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
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

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {dashboardCards.map((card) => (
            <SummaryCard
              key={card.title}
              title={card.title}
              description={card.description}
              status={card.status}
            />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
