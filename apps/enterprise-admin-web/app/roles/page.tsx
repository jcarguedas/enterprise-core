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
          <section className="app-card mt-6 rounded-lg border">
            <div className="app-divider border-b px-5 py-4">
              <h2 className="app-text text-base font-semibold">
                {t.rolesCatalog}
              </h2>
              <p className="app-subtle mt-1 text-sm">
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
                <table className="min-w-full divide-y divide-[var(--app-border)] text-left text-sm">
                  <thead className="app-table-head text-xs font-semibold uppercase">
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
                  <tbody className="app-table-body divide-y">
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <tr key={role.id}>
                          <td className="app-muted whitespace-nowrap px-5 py-4 font-medium">
                            {role.id}
                          </td>
                          <td className="app-text whitespace-nowrap px-5 py-4 font-medium">
                            {role.name}
                          </td>
                          <td className="app-muted whitespace-nowrap px-5 py-4">
                            {role.slug}
                          </td>
                          <td className="app-muted min-w-64 px-5 py-4">
                            {role.description ?? ""}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <span
                              className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${
                                role.is_active
                                  ? "app-badge-success"
                                  : "app-badge-neutral"
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
                          className="app-subtle px-5 py-6 text-center text-sm"
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
