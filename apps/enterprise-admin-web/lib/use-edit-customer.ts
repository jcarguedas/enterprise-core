"use client";

import { FormEvent, useState } from "react";

import { useToast } from "@/components/admin/ToastProvider";
import { getStoredToken } from "@/lib/auth-storage";
import {
  type CustomerPayload,
  type Customer,
  updateCustomer,
} from "@/lib/customers-api";
import { useI18n } from "@/lib/i18n/use-i18n";
import {
  localizeApiErrorMessage,
  localizeApiErrorMessages,
} from "@/lib/localized-api-errors";

type UseEditCustomerOptions = {
  onCustomerUpdated: (updatedCustomer: Customer) => void;
  onInactiveAccount: () => void;
  onUnauthorized: () => void;
};

function normalizeOptionalValue(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

export function useEditCustomer({
  onCustomerUpdated,
  onInactiveAccount,
  onUnauthorized,
}: UseEditCustomerOptions) {
  const { addToast } = useToast();
  const { messages: t } = useI18n();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
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

  function startEditingCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setName(customer.name);
    setEmail(customer.email ?? "");
    setPhone(customer.phone ?? "");
    setIdentificationType(customer.identification_type ?? "");
    setIdentificationNumber(customer.identification_number ?? "");
    setAddress(customer.address ?? "");
    setNotes(customer.notes ?? "");
    setIsActive(customer.is_active);
    setErrorMessages([]);
    setIsFormVisible(true);
  }

  function cancelEditing() {
    setSelectedCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setIdentificationType("");
    setIdentificationNumber("");
    setAddress("");
    setNotes("");
    setIsActive(true);
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

    if (!selectedCustomer) {
      return;
    }

    setIsSubmitting(true);

    const token = getStoredToken();

    if (!token) {
      setIsSubmitting(false);
      onUnauthorized();
      return;
    }

    const result = await updateCustomer(
      token,
      selectedCustomer.id,
      getPayload(),
    );

    setIsSubmitting(false);

    if (result.status === "success") {
      onCustomerUpdated(result.customer);
      cancelEditing();
      addToast({
        message: t.customerUpdatedSuccessfully,
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
    selectedCustomer,
    cancelEditing,
    clearErrorMessages,
    setAddress,
    setEmail,
    setIdentificationNumber,
    setIdentificationType,
    setIsActive,
    setName,
    setNotes,
    setPhone,
    startEditingCustomer,
    submit,
  };
}
