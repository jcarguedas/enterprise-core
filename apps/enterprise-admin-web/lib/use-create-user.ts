"use client";

import { FormEvent, useState } from "react";

import { getStoredToken } from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { createUser, EnterpriseUser } from "@/lib/users-api";

type UseCreateUserOptions = {
  onUserCreated: (createdUser: EnterpriseUser) => void;
  onUnauthorized: () => void;
};

export function useCreateUser({
  onUserCreated,
  onUnauthorized,
}: UseCreateUserOptions) {
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
      setSuccessMessage(t.userCreatedSuccessfully);
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
    setEmail,
    setName,
    setPassword,
    setPasswordConfirmation,
    showForm,
    submit,
  };
}
