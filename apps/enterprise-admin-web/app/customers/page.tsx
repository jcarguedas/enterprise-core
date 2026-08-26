"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { AccessDeniedState } from "@/components/admin/AccessDeniedState";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { clearStoredAuth } from "@/lib/auth-storage";
import type { Customer } from "@/lib/customers-api";
import { useI18n } from "@/lib/i18n/use-i18n";
import { INACTIVE_ACCOUNT_LOGIN_PATH } from "@/lib/inactive-account";
import {
  hasPermission,
  VIEW_CUSTOMERS_PERMISSION,
} from "@/lib/permissions";
import { productDisplayName } from "@/lib/product-info";
import { useCustomers } from "@/lib/use-customers";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";

function formatIdentification(customer: Customer, unavailable: string) {
  const identificationParts = [
    customer.identification_type,
    customer.identification_number,
  ].filter(Boolean);

  return identificationParts.length > 0
    ? identificationParts.join(" ")
    : unavailable;
}

function CustomersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages: t } = useI18n();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();
  const [searchQuery, setSearchQuery] = useState("");
  const canViewCustomers = hasPermission(
    trustedUser,
    VIEW_CUSTOMERS_PERMISSION,
  );
  const handleUnauthorized = useCallback(() => {
    clearStoredAuth();
    router.replace("/login");
  }, [router]);
  const handleInactiveAccount = useCallback(() => {
    clearStoredAuth();
    router.replace(INACTIVE_ACCOUNT_LOGIN_PATH);
  }, [router]);
  const customersFlow = useCustomers({
    onInactiveAccount: handleInactiveAccount,
    onUnauthorized: handleUnauthorized,
  });
  const {
    customers,
    errorMessage: customersErrorMessage,
    isRefreshing,
    loadCustomers,
    refreshCustomers,
    status: customersStatus,
  } = customersFlow;
  const normalizedSearchQuery = searchQuery.trim().replace(/\s+/g, " ");
  const displayedCustomers = useMemo(() => {
    const normalizedQuery = normalizedSearchQuery.toLowerCase();

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) => {
      const statusLabel = customer.is_active ? t.active : t.inactive;
      const searchableText = [
        customer.id.toString(),
        customer.name,
        customer.email,
        customer.phone,
        customer.identification_type,
        customer.identification_number,
        statusLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [customers, normalizedSearchQuery, t.active, t.inactive]);
  const emptyMessage =
    customers.length > 0 && normalizedSearchQuery
      ? t.noCustomersMatchSearch
      : t.noCustomersFound;
  const isAccessDenied =
    (status === "ready" && !canViewCustomers) ||
    customersStatus === "access_denied";

  function handleSearchQueryChange(nextSearchQuery: string) {
    setSearchQuery(nextSearchQuery);
  }

  useEffect(() => {
    if (status !== "ready" || !canViewCustomers) {
      return;
    }

    let isCurrent = true;

    Promise.resolve().then(() => {
      if (!isCurrent) {
        return;
      }

      loadCustomers({ shouldApplyResult: () => isCurrent });
    });

    return () => {
      isCurrent = false;
    };
  }, [canViewCustomers, loadCustomers, status]);

  useEffect(() => {
    const search = searchParams.get("search");

    if (status !== "ready" || !canViewCustomers || search === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleSearchQueryChange(search);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canViewCustomers, searchParams, status]);

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
          title={t.customerManagement}
          description={t.customersDescription}
          rightBadge={t.readOnly}
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
            title={t.customersAccessDenied}
            description={t.customersAccessDeniedDescription}
          />
        ) : null}

        {!isAccessDenied && status === "ready" ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SummaryCard
                title={t.customers}
                status={customers.length.toString()}
                description={t.customersDescription}
              />
              <SummaryCard
                title={t.readOnly}
                status={VIEW_CUSTOMERS_PERMISSION}
                description={t.customersReadOnlyDescription}
              />
            </div>

            <section className="app-card mt-6 rounded-lg border">
              <div className="app-divider flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="app-text text-base font-semibold">
                    {t.customers}
                  </h2>
                  <p className="app-subtle mt-1 text-sm">
                    {t.customersDescription}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshCustomers}
                  disabled={customersStatus === "loading" || isRefreshing}
                  className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isRefreshing ? t.refreshingCustomers : t.refreshCustomers}
                </button>
              </div>

              {customersStatus === "loading" ? (
                <StatusMessage variant="info" className="px-5 py-5">
                  {isRefreshing ? t.refreshingCustomers : t.loadingCustomers}
                </StatusMessage>
              ) : null}

              {customersStatus === "error" ? (
                <StatusMessage variant="error" className="m-5">
                  {customersErrorMessage}
                </StatusMessage>
              ) : null}

              {customersStatus === "ready" ? (
                <>
                  <div className="app-divider border-b px-5 py-4">
                    <label
                      htmlFor="customers-search"
                      className="app-muted block text-sm font-medium"
                    >
                      {t.searchCustomers}
                    </label>
                    <div className="mt-2 flex max-w-xl gap-2">
                      <input
                        id="customers-search"
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                          handleSearchQueryChange(event.target.value)
                        }
                        placeholder={t.searchCustomersPlaceholder}
                        className="app-input block h-10 min-w-0 flex-1 rounded-md border px-3 text-sm shadow-sm outline-none transition-colors"
                      />
                      {searchQuery ? (
                        <button
                          type="button"
                          onClick={() => handleSearchQueryChange("")}
                          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
                          aria-label={t.clearSearch}
                        >
                          {t.clearSearch}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {displayedCustomers.length === 0 ? (
                    <p className="app-muted px-5 py-8 text-center text-sm">
                      {emptyMessage}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[var(--app-border)] text-left text-sm">
                        <thead className="app-table-head">
                          <tr>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.id}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.name}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.email}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.phone}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.identification}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.status}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--app-border)]">
                          {displayedCustomers.map((customer) => (
                            <tr key={customer.id}>
                              <td className="app-text whitespace-nowrap px-5 py-4 font-medium">
                                {customer.id}
                              </td>
                              <td className="app-text whitespace-nowrap px-5 py-4 font-medium">
                                {customer.name}
                              </td>
                              <td className="app-muted whitespace-nowrap px-5 py-4">
                                {customer.email ?? t.unavailable}
                              </td>
                              <td className="app-muted whitespace-nowrap px-5 py-4">
                                {customer.phone ?? t.unavailable}
                              </td>
                              <td className="app-muted whitespace-nowrap px-5 py-4">
                                {formatIdentification(customer, t.unavailable)}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${
                                    customer.is_active
                                      ? "app-badge-success"
                                      : "app-badge-warning"
                                  }`}
                                >
                                  {customer.is_active ? t.active : t.inactive}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersContent />
    </Suspense>
  );
}
