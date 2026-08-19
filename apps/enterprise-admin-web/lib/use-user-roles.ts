"use client";

import { useRef, useState } from "react";

import { getStoredToken } from "@/lib/auth-storage";
import { getUserRoles } from "@/lib/users-api";
import type { EnterpriseRole, EnterpriseUser } from "@/lib/users-api";

type UseUserRolesOptions = {
  onUnauthorized: () => void;
};

export function useUserRoles({ onUnauthorized }: UseUserRolesOptions) {
  const requestIdRef = useRef(0);
  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null);
  const [roles, setRoles] = useState<EnterpriseRole[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function showRolesForUser(user: EnterpriseUser) {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setSelectedUser(user);
    setRoles([]);
    setErrorMessage("");
    setIsVisible(true);
    setIsLoading(true);

    const token = getStoredToken();

    if (!token) {
      setIsLoading(false);
      onUnauthorized();
      return;
    }

    const result = await getUserRoles(token, user.id);

    if (requestId !== requestIdRef.current) {
      return;
    }

    setIsLoading(false);

    if (result.status === "success") {
      setRoles(result.roles);
      return;
    }

    if (result.status === "unauthorized") {
      onUnauthorized();
      return;
    }

    setErrorMessage(result.message);
  }

  function closeRolesPanel() {
    requestIdRef.current += 1;
    setSelectedUser(null);
    setRoles([]);
    setErrorMessage("");
    setIsLoading(false);
    setIsVisible(false);
  }

  return {
    errorMessage,
    isLoading,
    isVisible,
    roles,
    selectedUser,
    closeRolesPanel,
    showRolesForUser,
  };
}
