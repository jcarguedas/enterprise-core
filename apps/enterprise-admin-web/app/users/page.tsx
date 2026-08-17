"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { clearStoredAuth, getStoredToken } from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";
import { EnterpriseUser, getUsers } from "@/lib/users-api";

type UsersLoadStatus = "idle" | "loading" | "ready" | "error";

const usersSummaryCards = [
  {
    title: t.userDirectory,
    getDescription: (users: EnterpriseUser[]) =>
      `${users.length} enterprise account${users.length === 1 ? "" : "s"} available.`,
  },
  {
    title: t.roleAssignments,
    getDescription: () => t.roleAssignmentsDescription,
  },
  {
    title: t.accessStatus,
    getDescription: () => t.accessStatusDescription,
  },
];

export default function UsersPage() {
  const router = useRouter();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    userDisplayName,
  } = useProtectedAdminSession();
  const [users, setUsers] = useState<EnterpriseUser[]>([]);
  const [usersStatus, setUsersStatus] = useState<UsersLoadStatus>("idle");
  const [usersErrorMessage, setUsersErrorMessage] = useState("");

  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    let isCurrent = true;
    const token = getStoredToken();

    if (!token) {
      clearStoredAuth();
      router.replace("/login");
      return;
    }

    async function loadUsers(currentToken: string) {
      setUsersStatus("loading");
      setUsersErrorMessage("");

      const result = await getUsers(currentToken);

      if (!isCurrent) {
        return;
      }

      if (result.status === "success") {
        setUsers(result.users);
        setUsersStatus("ready");
        return;
      }

      if (result.status === "unauthorized") {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setUsers([]);
      setUsersErrorMessage(result.message);
      setUsersStatus("error");
    }

    loadUsers(token);

    return () => {
      isCurrent = false;
    };
  }, [router, status]);

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      isLoggingOut={isLoggingOut}
      onLogout={logout}
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow={t.productName}
          title={t.users}
          description={t.usersDescription}
          rightBadge={t.comingNext}
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

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {usersSummaryCards.map((card) => (
            <SummaryCard
              key={card.title}
              title={card.title}
              description={card.getDescription(users)}
            />
          ))}
        </div>

        <section className="mt-6 rounded-lg border border-[#d8dee8] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-2 border-b border-[#e2e8f0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0f172a]">
                {t.userDirectory}
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                {t.userDirectoryDescription}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
                {t.crudComingNext}
              </span>
              <button
                type="button"
                disabled
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#172033] px-4 text-sm font-semibold text-white shadow-sm opacity-55 disabled:cursor-not-allowed"
              >
                {t.createUser}
              </button>
            </div>
          </div>

          {usersStatus === "loading" ? (
            <StatusMessage variant="info" className="px-5 py-5">
              {t.loadingUsers}
            </StatusMessage>
          ) : null}

          {usersStatus === "error" ? (
            <StatusMessage variant="error" className="m-5">
              {usersErrorMessage}
            </StatusMessage>
          ) : null}

          {usersStatus === "ready" ? (
            <UsersTable users={users} />
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
