"use client";

import type { FormEventHandler } from "react";

import { StatusMessage } from "@/components/admin/StatusMessage";
import { useI18n } from "@/lib/i18n/use-i18n";

type EditUserFormProps = {
  name: string;
  email: string;
  isSubmitting: boolean;
  errorMessages: string[];
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onClearErrorMessages: () => void;
};

export function EditUserForm({
  name,
  email,
  isSubmitting,
  errorMessages,
  onNameChange,
  onEmailChange,
  onSubmit,
  onCancel,
  onClearErrorMessages,
}: EditUserFormProps) {
  const { messages: t } = useI18n();

  return (
    <form
      className="app-form-panel border-b px-5 py-5"
      onSubmit={onSubmit}
    >
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
            htmlFor="edit-user-name"
            className="app-muted block text-sm font-medium"
          >
            {t.name}
          </label>
          <input
            id="edit-user-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            disabled={isSubmitting}
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="edit-user-email"
            className="app-muted block text-sm font-medium"
          >
            {t.email}
          </label>
          <input
            id="edit-user-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={isSubmitting}
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="app-button-primary inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t.updatingUser : t.saveChanges}
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
