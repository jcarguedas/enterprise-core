"use client";

import { FormEvent, useState } from "react";

import { getStoredToken } from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { EnterpriseUser, updateUser } from "@/lib/users-api";

type UseEditUserOptions = {
  onInactiveAccount: () => void;
  onUserUpdated: (updatedUser: EnterpriseUser) => void;
  onUnauthorized: () => void;
};

export function useEditUser({
  onInactiveAccount,
  onUserUpdated,
  onUnauthorized,
}: UseEditUserOptions) {
  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  function startEditingUser(user: EnterpriseUser) {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setSuccessMessage("");
    setErrorMessages([]);
    setIsFormVisible(true);
  }

  function cancelEditing() {
    setSelectedUser(null);
    setName("");
    setEmail("");
    setErrorMessages([]);
    setIsFormVisible(false);
  }

  function clearSuccessMessage() {
    setSuccessMessage("");
  }

  function clearErrorMessages() {
    setErrorMessages([]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessages([]);

    if (!selectedUser) {
      return;
    }

    setIsSubmitting(true);

    const token = getStoredToken();

    if (!token) {
      setIsSubmitting(false);
      onUnauthorized();
      return;
    }

    const result = await updateUser(token, selectedUser.id, {
      name,
      email,
    });

    setIsSubmitting(false);

    if (result.status === "success") {
      onUserUpdated(result.user);
      setSelectedUser(null);
      setName("");
      setEmail("");
      setIsFormVisible(false);
      setSuccessMessage(t.userUpdatedSuccessfully);
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
      setErrorMessages(result.messages);
      return;
    }

    setErrorMessages([result.message]);
  }

  return {
    email,
    errorMessages,
    isFormVisible,
    isSubmitting,
    name,
    selectedUser,
    successMessage,
    cancelEditing,
    clearErrorMessages,
    clearSuccessMessage,
    setEmail,
    setName,
    startEditingUser,
    submit,
  };
}
