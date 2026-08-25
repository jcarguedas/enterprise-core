"use client";

import { useRef, useState } from "react";

import { useToast } from "@/components/admin/ToastProvider";
import { getStoredToken } from "@/lib/auth-storage";
import { useI18n } from "@/lib/i18n/use-i18n";
import {
  assignUserRole,
  getRoles,
  getUserRoles,
  removeUserRole,
} from "@/lib/users-api";
import type { EnterpriseRole, EnterpriseUser } from "@/lib/users-api";

type UseUserRolesOptions = {
  onInactiveAccount: () => void;
  onUnauthorized: () => void;
};

export function useUserRoles({
  onInactiveAccount,
  onUnauthorized,
}: UseUserRolesOptions) {
  const { addToast } = useToast();
  const { messages: t } = useI18n();
  const requestIdRef = useRef(0);
  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null);
  const [roles, setRoles] = useState<EnterpriseRole[]>([]);
  const [availableRoles, setAvailableRoles] = useState<EnterpriseRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  const [removingRoleId, setRemovingRoleId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [assignErrorMessages, setAssignErrorMessages] = useState<string[]>([]);
  const [assignSuccessMessage, setAssignSuccessMessage] = useState("");

  async function showRolesForUser(user: EnterpriseUser) {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setSelectedUser(user);
    setRoles([]);
    setAvailableRoles([]);
    setSelectedRoleId("");
    setErrorMessage("");
    setAssignErrorMessages([]);
    setAssignSuccessMessage("");
    setIsVisible(true);
    setIsLoading(true);

    const token = getStoredToken();

    if (!token) {
      setIsLoading(false);
      onUnauthorized();
      return;
    }

    const [userRolesResult, availableRolesResult] = await Promise.all([
      getUserRoles(token, user.id),
      getRoles(token),
    ]);

    if (requestId !== requestIdRef.current) {
      return;
    }

    setIsLoading(false);

    if (
      userRolesResult.status === "unauthorized" ||
      availableRolesResult.status === "unauthorized"
    ) {
      onUnauthorized();
      return;
    }

    if (
      userRolesResult.status === "inactive_account" ||
      availableRolesResult.status === "inactive_account"
    ) {
      onInactiveAccount();
      return;
    }

    if (userRolesResult.status === "success") {
      setRoles(userRolesResult.roles);
    } else {
      setErrorMessage(userRolesResult.message);
    }

    if (availableRolesResult.status === "success") {
      setAvailableRoles(availableRolesResult.roles);
      return;
    }

    setAssignErrorMessages([availableRolesResult.message]);
  }

  async function assignSelectedRole() {
    if (removingRoleId !== null) {
      return;
    }

    setAssignErrorMessages([]);
    setAssignSuccessMessage("");

    if (!selectedUser || !selectedRoleId) {
      return;
    }

    const requestId = requestIdRef.current;
    const roleId = Number(selectedRoleId);

    if (!Number.isInteger(roleId)) {
      setAssignErrorMessages(["Please select a valid role and try again."]);
      return;
    }

    setIsAssigningRole(true);

    const token = getStoredToken();

    if (!token) {
      setIsAssigningRole(false);
      onUnauthorized();
      return;
    }

    const result = await assignUserRole(token, selectedUser.id, roleId);

    if (requestId !== requestIdRef.current) {
      return;
    }

    setIsAssigningRole(false);

    if (result.status === "success") {
      setRoles(result.roles);
      setSelectedRoleId("");
      addToast({
        message: t.roleAssignedSuccessfully,
        variant: "success",
      });
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

    if (result.status === "validation_error") {
      setAssignErrorMessages(result.messages);
      return;
    }

    setAssignErrorMessages([result.message]);
  }

  async function removeRole(roleId: number) {
    if (!selectedUser || isLoading || isAssigningRole || removingRoleId !== null) {
      return;
    }

    const requestId = requestIdRef.current;

    setAssignErrorMessages([]);
    setAssignSuccessMessage("");
    setRemovingRoleId(roleId);

    const token = getStoredToken();

    if (!token) {
      setRemovingRoleId(null);
      onUnauthorized();
      return;
    }

    const result = await removeUserRole(token, selectedUser.id, roleId);

    if (requestId !== requestIdRef.current) {
      return;
    }

    setRemovingRoleId(null);

    if (result.status === "success") {
      setRoles(result.roles);
      addToast({
        message: t.roleRemovedSuccessfully,
        variant: "success",
      });
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

    setAssignErrorMessages([result.message]);
  }

  function closeRolesPanel() {
    requestIdRef.current += 1;
    setSelectedUser(null);
    setRoles([]);
    setAvailableRoles([]);
    setSelectedRoleId("");
    setErrorMessage("");
    setAssignErrorMessages([]);
    setAssignSuccessMessage("");
    setIsLoading(false);
    setIsAssigningRole(false);
    setRemovingRoleId(null);
    setIsVisible(false);
  }

  function clearErrorMessage() {
    setErrorMessage("");
  }

  function clearAssignErrorMessages() {
    setAssignErrorMessages([]);
  }

  function clearAssignSuccessMessage() {
    setAssignSuccessMessage("");
  }

  return {
    assignErrorMessages,
    assignSuccessMessage,
    availableRoles,
    errorMessage,
    isAssigningRole,
    isLoading,
    isVisible,
    removingRoleId,
    roles,
    selectedUser,
    selectedRoleId,
    assignSelectedRole,
    clearAssignErrorMessages,
    clearAssignSuccessMessage,
    clearErrorMessage,
    closeRolesPanel,
    removeRole,
    setSelectedRoleId,
    showRolesForUser,
  };
}
