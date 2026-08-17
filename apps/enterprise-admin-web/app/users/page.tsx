"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { clearStoredAuth, getStoredToken } from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";
import { EnterpriseUser, getUsers } from "@/lib/users-api";

type UsersLoadStatus = "idle" | "loading" | "ready" | "error";

const usersSummaryCards = [
  {
    title: "User Directory",
    getDescription: (users: EnterpriseUser[]) =>
      `${users.length} enterprise account${users.length === 1 ? "" : "s"} available.`,
  },
  {
    title: "Role Assignments",
    getDescription: () =>
      "Role assignment workflows will connect to this workspace next.",
  },
  {
    title: "Access Status",
    getDescription: () =>
      "Access readiness tracking is planned for the user management module.",
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
          {usersSummaryCards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]"
            >
              <h2 className="text-base font-semibold text-[#0f172a]">
                {card.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#475569]">
                {card.getDescription(users)}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-6 rounded-lg border border-[#d8dee8] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-2 border-b border-[#e2e8f0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0f172a]">
                User Directory
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                Read-only view of enterprise-managed users.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
              Read only
            </span>
          </div>

          {usersStatus === "loading" ? (
            <p className="px-5 py-5 text-sm font-medium text-[#475569]">
              Loading users...
            </p>
          ) : null}

          {usersStatus === "error" ? (
            <div
              aria-live="polite"
              className="m-5 rounded-md border border-[#f1b8b8] bg-[#fff5f5] px-4 py-3 text-sm leading-6 text-[#9b2c2c]"
            >
              {usersErrorMessage}
            </div>
          ) : null}

          {usersStatus === "ready" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e2e8f0] text-left text-sm">
                <thead className="bg-[#f8fafc] text-xs font-semibold uppercase text-[#64748b]">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2f7] bg-white">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-[#334155]">
                          {user.id}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-[#0f172a]">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-[#475569]">
                          {user.email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-6 text-center text-sm text-[#64748b]"
                      >
                        No users were returned by the API.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
