"use client";

import { useState } from "react";

import { getStoredToken } from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { updateUser } from "@/lib/users-api";
import type { EnterpriseUser } from "@/lib/users-api";

type UseUserStatusOptions = {
  onUnauthorized: () => void;
  onUserUpdated: (updatedUser: EnterpriseUser) => void;
};

export function useUserStatus({
  onUnauthorized,
  onUserUpdated,
}: UseUserStatusOptions) {
  const [updatingUserStatusId, setUpdatingUserStatusId] = useState<
    number | null
  >(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  async function updateUserStatus(user: EnterpriseUser) {
    if (updatingUserStatusId !== null) {
      return;
    }

    setSuccessMessage("");
    setErrorMessages([]);
    setUpdatingUserStatusId(user.id);

    const token = getStoredToken();

    if (!token) {
      setUpdatingUserStatusId(null);
      onUnauthorized();
      return;
    }

    const nextIsActive = !user.is_active;
    const result = await updateUser(token, user.id, {
      is_active: nextIsActive,
    });

    setUpdatingUserStatusId(null);

    if (result.status === "success") {
      onUserUpdated(result.user);
      setSuccessMessage(
        result.user.is_active
          ? t.userReactivatedSuccessfully
          : t.userDeactivatedSuccessfully,
      );
      return;
    }

    if (result.status === "unauthorized") {
      onUnauthorized();
      return;
    }

    if (result.status === "validation_error") {
      setErrorMessages(result.messages);
      return;
    }

    setErrorMessages([result.message]);
  }

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessages([]);
  }

  return {
    errorMessages,
    successMessage,
    updatingUserStatusId,
    clearMessages,
    updateUserStatus,
  };
}
