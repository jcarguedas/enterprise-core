"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

import { LanguageSelector } from "@/components/admin/LanguageSelector";
import { ThemeSelector } from "@/components/admin/ThemeSelector";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { apiConfig } from "@/lib/api-config";
import { getStoredToken, storeAuth } from "@/lib/auth-storage";
import type { SharedMessages } from "@/lib/i18n/messages";
import { useI18n } from "@/lib/i18n/use-i18n";
import { INACTIVE_ACCOUNT_LOGIN_REASON } from "@/lib/inactive-account";
import { getSafeLoginApiErrorMessage } from "@/lib/localized-api-errors";
import { productDisplayName } from "@/lib/product-info";

type LoginResponse = {
  token?: string;
  token_type?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  message?: string;
  errors?: Record<string, string[]>;
};

function getLoginErrorMessage(
  response: LoginResponse,
  messages: SharedMessages,
  status: number,
) {
  if (response.errors) {
    const errorMessages = Object.values(response.errors).flat();

    if (errorMessages.length > 0) {
      return getSafeLoginApiErrorMessage({
        messages,
        rawMessages: errorMessages,
        status,
      });
    }
  }

  return response.message
    ? getSafeLoginApiErrorMessage({
        messages,
        rawMessages: [response.message],
        status,
      })
    : messages.loginGenericError;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages: t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inactiveRedirectMessage =
    !hasSubmitted &&
    searchParams.get("reason") === INACTIVE_ACCOUNT_LOGIN_REASON
      ? t.inactiveAccountLoginMessage
      : "";
  const visibleErrorMessage = errorMessage || inactiveRedirectMessage;

  useEffect(() => {
    if (getStoredToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiConfig.baseUrl}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as LoginResponse;

      if (!response.ok) {
        setErrorMessage(getLoginErrorMessage(data, t, response.status));
        return;
      }

      if (!data.token || !data.user) {
        setErrorMessage(t.loginIncompleteResponse);
        return;
      }

      storeAuth(data.token, data.user);
      router.push("/dashboard");
    } catch {
      setErrorMessage(t.authServiceUnavailable);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-bg min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <header className="app-divider flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="app-brand-mark flex size-10 items-center justify-center rounded-md text-sm font-semibold">
              EC
            </div>
            <div>
              <p className="app-text text-sm font-semibold">
                {productDisplayName}
              </p>
              <p className="app-subtle text-xs uppercase tracking-[0.18em]">
                {t.adminWeb}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <LanguageSelector />
            <ThemeSelector />
            <Link
              href="/"
              className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
            >
              {t.backToOverview}
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[0.92fr_1fr] lg:py-16">
          <div className="max-w-xl">
            <p className="app-button-secondary mb-5 inline-flex rounded-md border px-3 py-1 text-sm font-medium shadow-sm">
              {t.loginEyebrow}
            </p>
            <h1 className="app-text text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              {productDisplayName}
            </h1>
            <p className="app-muted mt-4 text-2xl font-medium">
              {t.loginTitle}
            </p>
            <p className="app-muted mt-6 text-base leading-7">
              {t.loginDescription}
            </p>
          </div>

          <div className="app-card-lg w-full max-w-md justify-self-center rounded-lg border p-6 sm:p-8 lg:justify-self-end">
            <div className="app-divider border-b pb-5">
              <p className="app-text text-sm font-semibold">
                {t.signInToAdmin}
              </p>
              <p className="app-subtle mt-1 text-sm">
                {t.accessPortal}
              </p>
            </div>

            <form method="post" className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {visibleErrorMessage ? (
                <div
                  aria-live="polite"
                  className="app-status-error rounded-md border px-4 py-3 text-sm leading-6"
                >
                  {visibleErrorMessage}
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="email"
                  className="app-muted block text-sm font-medium"
                >
                  {t.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  className="app-input mt-2 block h-12 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="app-muted block text-sm font-medium"
                >
                  {t.password}
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isSubmitting}
                    className="app-input block h-12 w-full rounded-md border px-3 pr-12 text-sm shadow-sm outline-none transition-colors"
                    placeholder={t.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    aria-label={
                      isPasswordVisible ? t.hidePassword : t.showPassword
                    }
                    disabled={isSubmitting}
                    onClick={() =>
                      setIsPasswordVisible((currentValue) => !currentValue)
                    }
                    className="app-button-secondary absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] disabled:cursor-not-allowed"
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="app-button-primary inline-flex h-12 w-full items-center justify-center rounded-md px-6 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.signingIn : t.signIn}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
