"use client";

import { useCallback, useState } from "react";

import { getStoredToken } from "@/lib/auth-storage";
import { useI18n } from "@/lib/i18n/use-i18n";
import { getSystemEvents } from "@/lib/system-events-api";
import type { SystemEvent } from "@/lib/system-events-api";

type SystemEventsStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "access_denied";

type UseSystemEventsOptions = {
  onInactiveAccount: () => void;
  onUnauthorized: () => void;
};

export function useSystemEvents({
  onInactiveAccount,
  onUnauthorized,
}: UseSystemEventsOptions) {
  const { messages: t } = useI18n();
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [status, setStatus] = useState<SystemEventsStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadEvents = useCallback(
    async ({
      isRefresh = false,
      shouldApplyResult = () => true,
    }: {
      isRefresh?: boolean;
      shouldApplyResult?: () => boolean;
    } = {}) => {
      const token = getStoredToken();

      if (!token) {
        onUnauthorized();
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      if (isRefresh) {
        setIsRefreshing(true);
      }

      const result = await getSystemEvents(token);

      if (!shouldApplyResult()) {
        return;
      }

      if (isRefresh) {
        setIsRefreshing(false);
      }

      if (result.status === "success") {
        setEvents(result.events);
        setStatus("ready");
        return;
      }

      if (result.status === "unauthorized") {
        onUnauthorized();
        return;
      }

      if (result.status === "inactive_account") {
        onInactiveAccount();
        return;
      }

      if (result.status === "forbidden") {
        setEvents([]);
        setStatus("access_denied");
        return;
      }

      setEvents([]);
      setErrorMessage(result.message || t.systemEventsLoadError);
      setStatus("error");
    },
    [onInactiveAccount, onUnauthorized, t.systemEventsLoadError],
  );

  const refreshEvents = useCallback(() => {
    loadEvents({ isRefresh: true });
  }, [loadEvents]);

  return {
    errorMessage,
    events,
    isRefreshing,
    loadEvents,
    refreshEvents,
    status,
  };
}
