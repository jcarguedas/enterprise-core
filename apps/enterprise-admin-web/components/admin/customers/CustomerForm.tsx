"use client";

import type { FormEventHandler } from "react";

import { StatusMessage } from "@/components/admin/StatusMessage";
import { useI18n } from "@/lib/i18n/use-i18n";

type CustomerFormMode = "create" | "edit";

type CustomerFormProps = {
  mode: CustomerFormMode;
  name: string;
  email: string;
  phone: string;
  identificationType: string;
  identificationNumber: string;
  address: string;
  notes: string;
  isActive: boolean;
  shouldAutoFocusName?: boolean;
  isSubmitting: boolean;
  errorMessages: string[];
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onIdentificationTypeChange: (value: string) => void;
  onIdentificationNumberChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onClearErrorMessages: () => void;
};

export function CustomerForm({
  mode,
  name,
  email,
  phone,
  identificationType,
  identificationNumber,
  address,
  notes,
  isActive,
  shouldAutoFocusName = false,
  isSubmitting,
  errorMessages,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onIdentificationTypeChange,
  onIdentificationNumberChange,
  onAddressChange,
  onNotesChange,
  onIsActiveChange,
  onSubmit,
  onCancel,
  onClearErrorMessages,
}: CustomerFormProps) {
  const { messages: t } = useI18n();
  const title = mode === "create" ? t.createCustomer : t.editCustomer;
  const submitLabel = mode === "create" ? t.saveCustomer : t.updateCustomer;
  const submittingLabel =
    mode === "create" ? t.creatingCustomer : t.updatingCustomer;

  return (
    <form className="app-form-panel border-b px-5 py-5" onSubmit={onSubmit}>
      <div className="mb-5">
        <h3 className="app-text text-sm font-semibold">{title}</h3>
        <p className="app-subtle mt-1 text-sm">{t.customerDetails}</p>
      </div>

      {errorMessages.length > 0 ? (
        <StatusMessage
          variant="error"
          className="mb-5"
          dismissible
          onDismiss={onClearErrorMessages}
        >
          <span className="font-semibold">{t.validationError}: </span>
          {errorMessages.join(" ")}
        </StatusMessage>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`${mode}-customer-name`}
            className="app-muted block text-sm font-medium"
          >
            {t.name}
          </label>
          <input
            id={`${mode}-customer-name`}
            name="name"
            type="text"
            autoComplete="organization"
            autoFocus={shouldAutoFocusName}
            required
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            disabled={isSubmitting}
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor={`${mode}-customer-email`}
            className="app-muted block text-sm font-medium"
          >
            {t.email}
          </label>
          <input
            id={`${mode}-customer-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={isSubmitting}
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor={`${mode}-customer-phone`}
            className="app-muted block text-sm font-medium"
          >
            {t.phone}
          </label>
          <input
            id={`${mode}-customer-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            disabled={isSubmitting}
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor={`${mode}-customer-identification-type`}
            className="app-muted block text-sm font-medium"
          >
            {t.identificationType}
          </label>
          <input
            id={`${mode}-customer-identification-type`}
            name="identification_type"
            type="text"
            value={identificationType}
            onChange={(event) =>
              onIdentificationTypeChange(event.target.value)
            }
            disabled={isSubmitting}
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor={`${mode}-customer-identification-number`}
            className="app-muted block text-sm font-medium"
          >
            {t.identificationNumber}
          </label>
          <input
            id={`${mode}-customer-identification-number`}
            name="identification_number"
            type="text"
            value={identificationNumber}
            onChange={(event) =>
              onIdentificationNumberChange(event.target.value)
            }
            disabled={isSubmitting}
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-end">
          <label className="app-muted inline-flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => onIsActiveChange(event.target.checked)}
              disabled={isSubmitting}
              className="size-4 rounded border-[var(--app-border)]"
            />
            <span>{t.active}</span>
          </label>
        </div>

        <div>
          <label
            htmlFor={`${mode}-customer-address`}
            className="app-muted block text-sm font-medium"
          >
            {t.address}
          </label>
          <textarea
            id={`${mode}-customer-address`}
            name="address"
            rows={3}
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            disabled={isSubmitting}
            className="app-input mt-2 block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor={`${mode}-customer-notes`}
            className="app-muted block text-sm font-medium"
          >
            {t.notes}
          </label>
          <textarea
            id={`${mode}-customer-notes`}
            name="notes"
            rows={3}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            disabled={isSubmitting}
            className="app-input mt-2 block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="app-button-primary inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
