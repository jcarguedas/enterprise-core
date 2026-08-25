"use client";

import type { FormEventHandler } from "react";

import { StatusMessage } from "@/components/admin/StatusMessage";
import { useI18n } from "@/lib/i18n/use-i18n";

type CreateUserFormProps = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  isSubmitting: boolean;
  errorMessages: string[];
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmationChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onClearErrorMessages: () => void;
};

export function CreateUserForm({
  name,
  email,
  password,
  passwordConfirmation,
  isSubmitting,
  errorMessages,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmationChange,
  onSubmit,
  onCancel,
  onClearErrorMessages,
}: CreateUserFormProps) {
  const { messages: t } = useI18n();

  return (
    <form
      className="border-b border-[#e2e8f0] bg-[#fbfcfe] px-5 py-5"
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="create-user-name"
            className="block text-sm font-medium text-[#334155]"
          >
            {t.name}
          </label>
          <input
            id="create-user-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            disabled={isSubmitting}
            className="mt-2 block h-11 w-full rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15 disabled:cursor-not-allowed disabled:bg-[#eef2f7]"
          />
        </div>

        <div>
          <label
            htmlFor="create-user-email"
            className="block text-sm font-medium text-[#334155]"
          >
            {t.email}
          </label>
          <input
            id="create-user-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={isSubmitting}
            className="mt-2 block h-11 w-full rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15 disabled:cursor-not-allowed disabled:bg-[#eef2f7]"
          />
        </div>

        <div>
          <label
            htmlFor="create-user-password"
            className="block text-sm font-medium text-[#334155]"
          >
            {t.password}
          </label>
          <input
            id="create-user-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            disabled={isSubmitting}
            className="mt-2 block h-11 w-full rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15 disabled:cursor-not-allowed disabled:bg-[#eef2f7]"
          />
        </div>

        <div>
          <label
            htmlFor="create-user-password-confirmation"
            className="block text-sm font-medium text-[#334155]"
          >
            {t.passwordConfirmation}
          </label>
          <input
            id="create-user-password-confirmation"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            required
            value={passwordConfirmation}
            onChange={(event) =>
              onPasswordConfirmationChange(event.target.value)
            }
            disabled={isSubmitting}
            className="mt-2 block h-11 w-full rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15 disabled:cursor-not-allowed disabled:bg-[#eef2f7]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#172033] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#24324d] focus:outline-none focus:ring-2 focus:ring-[#172033] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#526174]"
        >
          {isSubmitting ? t.creatingUser : t.createUser}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-4 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
