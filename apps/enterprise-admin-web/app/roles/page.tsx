"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AccessDeniedState } from "@/components/admin/AccessDeniedState";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { clearStoredAuth, getStoredToken } from "@/lib/auth-storage";
import { useI18n } from "@/lib/i18n/use-i18n";
import { INACTIVE_ACCOUNT_LOGIN_PATH } from "@/lib/inactive-account";
import { hasPermission, MANAGE_USERS_PERMISSION } from "@/lib/permissions";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";
import { getRoles } from "@/lib/users-api";
import type { EnterpriseRole } from "@/lib/users-api";

type RolesLoadStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "access_denied";

export default function RolesPage() {
  const router = useRouter();
  const { messages: t } = useI18n();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();
  const [roles, setRoles] = useState<EnterpriseRole[]>([]);
  const [rolesStatus, setRolesStatus] = useState<RolesLoadStatus>("idle");
  const [rolesErrorMessage, setRolesErrorMessage] = useState("");
  const canManageUsers = hasPermission(trustedUser, MANAGE_USERS_PERMISSION);
  const isAccessDenied =
    (status === "ready" && !canManageUsers) ||
    rolesStatus === "access_denied";

  const handleInactiveAccount = useCallback(() => {
    clearStoredAuth();
    router.replace(INACTIVE_ACCOUNT_LOGIN_PATH);
  }, [router]);

  const loadRoles = useCallback(
    async (
      currentToken: string,
      options: {
        shouldApplyResult?: () => boolean;
      } = {},
    ) => {
      const { shouldApplyResult = () => true } = options;

      if (!canManageUsers) {
        return;
      }

      setRolesStatus("loading");
      setRolesErrorMessage("");

      const result = await getRoles(currentToken);

      if (!shouldApplyResult()) {
        return;
      }

      if (result.status === "success") {
        setRoles(result.roles);
        setRolesStatus("ready");
        return;
      }

      if (result.status === "unauthorized") {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      if (result.status === "inactive_account") {
        handleInactiveAccount();
        return;
      }

      if (result.status === "forbidden") {
        setRoles([]);
        setRolesStatus("access_denied");
        return;
      }

      setRoles([]);
      setRolesErrorMessage(result.message);
      setRolesStatus("error");
    },
    [canManageUsers, handleInactiveAccount, router],
  );

  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    if (!canManageUsers) {
      return;
    }

    let isCurrent = true;
    const token = getStoredToken();

    if (!token) {
      clearStoredAuth();
      router.replace("/login");
      return;
    }

    Promise.resolve().then(() => {
      if (!isCurrent) {
        return;
      }

      loadRoles(token, { shouldApplyResult: () => isCurrent });
    });

    return () => {
      isCurrent = false;
    };
  }, [canManageUsers, loadRoles, router, status]);

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
          title={t.roles}
          description={t.rolesDescription}
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
            title={t.rolesAccessDenied}
            description={t.rolesAccessDeniedDescription}
          />
        ) : null}

        {!isAccessDenied ? (
          <section className="mt-6 rounded-lg border border-[#d8dee8] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <div className="border-b border-[#e2e8f0] px-5 py-4">
              <h2 className="text-base font-semibold text-[#0f172a]">
                {t.rolesCatalog}
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                {t.rolesCatalogDescription}
              </p>
            </div>

            {rolesStatus === "loading" ? (
              <StatusMessage variant="info" className="px-5 py-5">
                {t.loadingRoles}
              </StatusMessage>
            ) : null}

            {rolesStatus === "error" ? (
              <StatusMessage variant="error" className="m-5">
                {rolesErrorMessage}
              </StatusMessage>
            ) : null}

            {rolesStatus === "ready" ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e2e8f0] text-left text-sm">
                  <thead className="bg-[#f8fafc] text-xs font-semibold uppercase text-[#64748b]">
                    <tr>
                      <th scope="col" className="px-5 py-3">
                        {t.id}
                      </th>
                      <th scope="col" className="px-5 py-3">
                        {t.name}
                      </th>
                      <th scope="col" className="px-5 py-3">
                        {t.roleSlug}
                      </th>
                      <th scope="col" className="px-5 py-3">
                        {t.roleDescription}
                      </th>
                      <th scope="col" className="px-5 py-3">
                        {t.status}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf2f7] bg-white">
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <tr key={role.id}>
                          <td className="whitespace-nowrap px-5 py-4 font-medium text-[#334155]">
                            {role.id}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 font-medium text-[#0f172a]">
                            {role.name}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-[#475569]">
                            {role.slug}
                          </td>
                          <td className="min-w-64 px-5 py-4 text-[#475569]">
                            {role.description ?? ""}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <span
                              className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${
                                role.is_active
                                  ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                                  : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]"
                              }`}
                            >
                              {role.is_active ? t.active : t.inactive}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-6 text-center text-sm text-[#64748b]"
                        >
                          {t.noRolesReturned}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
