"use client";

import { FormEvent, useState } from "react";

import { useToast } from "@/components/admin/ToastProvider";
import { getStoredToken } from "@/lib/auth-storage";
import { useI18n } from "@/lib/i18n/use-i18n";
import {
  localizeApiErrorMessage,
  localizeApiErrorMessages,
} from "@/lib/localized-api-errors";
import { createUser, EnterpriseUser } from "@/lib/users-api";

type UseCreateUserOptions = {
  onInactiveAccount: () => void;
  onUserCreated: (createdUser: EnterpriseUser) => void;
  onUnauthorized: () => void;
};

export function useCreateUser({
  onInactiveAccount,
  onUserCreated,
  onUnauthorized,
}: UseCreateUserOptions) {
  const { addToast } = useToast();
  const { messages: t } = useI18n();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  }

  function showForm() {
    setSuccessMessage("");
    setErrorMessages([]);
    setIsFormVisible(true);
  }

  function cancelForm() {
    resetForm();
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
    setIsSubmitting(true);

    const token = getStoredToken();

    if (!token) {
      setIsSubmitting(false);
      onUnauthorized();
      return;
    }

    const result = await createUser(token, {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    setIsSubmitting(false);

    if (result.status === "success") {
      onUserCreated(result.user);
      resetForm();
      setIsFormVisible(false);
      addToast({
        message: t.userCreatedSuccessfully,
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
      setErrorMessages(localizeApiErrorMessages(result.messages, t));
      return;
    }

    setErrorMessages([localizeApiErrorMessage(result.message, t)]);
  }

  return {
    email,
    errorMessages,
    isFormVisible,
    isSubmitting,
    name,
    password,
    passwordConfirmation,
    successMessage,
    cancelForm,
    clearErrorMessages,
    clearSuccessMessage,
    setEmail,
    setName,
    setPassword,
    setPasswordConfirmation,
    showForm,
    submit,
  };
}
