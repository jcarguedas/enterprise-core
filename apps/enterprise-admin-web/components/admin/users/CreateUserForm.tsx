"use client";

import { useState } from "react";
import type { FormEventHandler } from "react";

import { StatusMessage } from "@/components/admin/StatusMessage";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] =
    useState(false);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="create-user-name"
            className="app-muted block text-sm font-medium"
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
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="create-user-email"
            className="app-muted block text-sm font-medium"
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
            className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="create-user-password"
            className="app-muted block text-sm font-medium"
          >
            {t.password}
          </label>
          <div className="relative mt-2">
            <input
              id="create-user-password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              disabled={isSubmitting}
              className="app-input block h-11 w-full rounded-md border px-3 pr-12 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
            />
            <button
              type="button"
              aria-label={isPasswordVisible ? t.hidePassword : t.showPassword}
              disabled={isSubmitting}
              onClick={() =>
                setIsPasswordVisible((currentValue) => !currentValue)
              }
              className="app-button-secondary absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] disabled:cursor-not-allowed"
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="create-user-password-confirmation"
            className="app-muted block text-sm font-medium"
          >
            {t.passwordConfirmation}
          </label>
          <div className="relative mt-2">
            <input
              id="create-user-password-confirmation"
              name="password_confirmation"
              type={isPasswordConfirmationVisible ? "text" : "password"}
              autoComplete="new-password"
              required
              value={passwordConfirmation}
              onChange={(event) =>
                onPasswordConfirmationChange(event.target.value)
              }
              disabled={isSubmitting}
              className="app-input block h-11 w-full rounded-md border px-3 pr-12 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
            />
            <button
              type="button"
              aria-label={
                isPasswordConfirmationVisible ? t.hidePassword : t.showPassword
              }
              disabled={isSubmitting}
              onClick={() =>
                setIsPasswordConfirmationVisible(
                  (currentValue) => !currentValue,
                )
              }
              className="app-button-secondary absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] disabled:cursor-not-allowed"
            >
              {isPasswordConfirmationVisible ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="app-button-primary inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t.creatingUser : t.createUser}
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
