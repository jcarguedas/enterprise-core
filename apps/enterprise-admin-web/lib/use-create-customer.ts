"use client";

import { FormEvent, useState } from "react";

import { useToast } from "@/components/admin/ToastProvider";
import { getStoredToken } from "@/lib/auth-storage";
import {
  createCustomer,
  type CustomerPayload,
  type Customer,
} from "@/lib/customers-api";
import { useI18n } from "@/lib/i18n/use-i18n";
import {
  localizeApiErrorMessage,
  localizeApiErrorMessages,
} from "@/lib/localized-api-errors";

type UseCreateCustomerOptions = {
  onCustomerCreated: (createdCustomer: Customer) => void;
  onInactiveAccount: () => void;
  onUnauthorized: () => void;
};

function normalizeOptionalValue(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

export function useCreateCustomer({
  onCustomerCreated,
  onInactiveAccount,
  onUnauthorized,
}: UseCreateCustomerOptions) {
  const { addToast } = useToast();
  const { messages: t } = useI18n();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identificationType, setIdentificationType] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setIdentificationType("");
    setIdentificationNumber("");
    setAddress("");
    setNotes("");
    setIsActive(true);
  }

  function showForm() {
    setErrorMessages([]);
    setIsFormVisible(true);
  }

  function cancelForm() {
    resetForm();
    setErrorMessages([]);
    setIsFormVisible(false);
  }

  function clearErrorMessages() {
    setErrorMessages([]);
  }

  function getPayload(): CustomerPayload {
    return {
      name: name.trim(),
      email: normalizeOptionalValue(email),
      phone: normalizeOptionalValue(phone),
      identification_type: normalizeOptionalValue(identificationType),
      identification_number: normalizeOptionalValue(identificationNumber),
      address: normalizeOptionalValue(address),
      notes: normalizeOptionalValue(notes),
      is_active: isActive,
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessages([]);
    setIsSubmitting(true);

    const token = getStoredToken();

    if (!token) {
      setIsSubmitting(false);
      onUnauthorized();
      return;
    }

    const result = await createCustomer(token, getPayload());

    setIsSubmitting(false);

    if (result.status === "success") {
      onCustomerCreated(result.customer);
      resetForm();
      setIsFormVisible(false);
      addToast({
        message: t.customerCreatedSuccessfully,
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

    if (result.status === "forbidden") {
      setErrorMessages([t.customersManageAccessDeniedDescription]);
      return;
    }

    if (result.status === "validation_error") {
      setErrorMessages(localizeApiErrorMessages(result.messages, t));
      return;
    }

    setErrorMessages([localizeApiErrorMessage(result.message, t)]);
  }

  return {
    address,
    email,
    errorMessages,
    identificationNumber,
    identificationType,
    isActive,
    isFormVisible,
    isSubmitting,
    name,
    notes,
    phone,
    cancelForm,
    clearErrorMessages,
    setAddress,
    setEmail,
    setIdentificationNumber,
    setIdentificationType,
    setIsActive,
    setName,
    setNotes,
    setPhone,
    showForm,
    submit,
  };
}
