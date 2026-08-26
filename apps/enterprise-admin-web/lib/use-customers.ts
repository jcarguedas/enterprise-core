"use client";

import { useCallback, useState } from "react";

import { clearStoredAuth, getStoredToken } from "@/lib/auth-storage";
import { useI18n } from "@/lib/i18n/use-i18n";
import { getCustomers } from "@/lib/customers-api";
import type { Customer } from "@/lib/customers-api";

type CustomersStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "access_denied";

type UseCustomersOptions = {
  onInactiveAccount: () => void;
  onUnauthorized: () => void;
};

export function useCustomers({
  onInactiveAccount,
  onUnauthorized,
}: UseCustomersOptions) {
  const { messages: t } = useI18n();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [status, setStatus] = useState<CustomersStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCustomers = useCallback(
    async ({
      isRefresh = false,
      shouldApplyResult = () => true,
    }: {
      isRefresh?: boolean;
      shouldApplyResult?: () => boolean;
    } = {}) => {
      const token = getStoredToken();

      if (!token) {
        clearStoredAuth();
        onUnauthorized();
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      if (isRefresh) {
        setIsRefreshing(true);
      }

      const result = await getCustomers(token);

      if (!shouldApplyResult()) {
        return;
      }

      if (isRefresh) {
        setIsRefreshing(false);
      }

      if (result.status === "success") {
        setCustomers(result.customers);
        setStatus("ready");
        return;
      }

      if (result.status === "unauthorized") {
        clearStoredAuth();
        onUnauthorized();
        return;
      }

      if (result.status === "inactive_account") {
        clearStoredAuth();
        onInactiveAccount();
        return;
      }

      if (result.status === "forbidden") {
        setCustomers([]);
        setStatus("access_denied");
        return;
      }

      setCustomers([]);
      setErrorMessage(result.message || t.customersLoadError);
      setStatus("error");
    },
    [onInactiveAccount, onUnauthorized, t.customersLoadError],
  );

  const refreshCustomers = useCallback(() => {
    loadCustomers({ isRefresh: true });
  }, [loadCustomers]);

  return {
    customers,
    errorMessage,
    isRefreshing,
    loadCustomers,
    refreshCustomers,
    status,
  };
}
