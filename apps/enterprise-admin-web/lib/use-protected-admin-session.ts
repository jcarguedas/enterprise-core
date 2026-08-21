"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getCurrentUser, logoutCurrentUser } from "@/lib/auth-api";
import {
  clearStoredAuth,
  getStoredToken,
  StoredUser,
  storeUser,
} from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { INACTIVE_ACCOUNT_LOGIN_PATH } from "@/lib/inactive-account";

export type SessionStatus = "checking" | "ready" | "error";

export function useProtectedAdminSession() {
  const router = useRouter();
  const [trustedUser, setTrustedUser] = useState<StoredUser | null>(null);
  const [status, setStatus] = useState<SessionStatus>("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const token = getStoredToken();

    if (!token) {
      clearStoredAuth();
      router.replace("/login");
      return;
    }

    async function validateSession(currentToken: string) {
      const result = await getCurrentUser(currentToken);

      if (!isCurrent) {
        return;
      }

      if (result.status === "authenticated") {
        storeUser(result.user);
        setTrustedUser(result.user);
        setErrorMessage("");
        setStatus("ready");
        return;
      }

      if (result.status === "unauthorized") {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      if (result.status === "inactive_account") {
        clearStoredAuth();
        router.replace(INACTIVE_ACCOUNT_LOGIN_PATH);
        return;
      }

      setTrustedUser(null);
      setErrorMessage(result.message);
      setStatus("error");
    }

    validateSession(token);

    return () => {
      isCurrent = false;
    };
  }, [router]);

  async function logout() {
    const token = getStoredToken();
    let logoutPath = "/login";
    setIsLoggingOut(true);

    try {
      if (token) {
        const result = await logoutCurrentUser(token);

        if (result.status === "inactive_account") {
          logoutPath = INACTIVE_ACCOUNT_LOGIN_PATH;
        }
      }
    } finally {
      clearStoredAuth();
      router.push(logoutPath);
    }
  }

  const userDisplayName =
    trustedUser?.name ||
    trustedUser?.email ||
    (status === "checking" ? t.validatingSession : "Session unavailable");

  return {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  };
}
