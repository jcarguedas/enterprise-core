"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { apiConfig } from "@/lib/api-config";
import { getStoredToken, storeAuth } from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";

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

function getLoginErrorMessage(response: LoginResponse) {
  if (response.errors) {
    const messages = Object.values(response.errors).flat();

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return response.message ?? "Unable to sign in. Please verify your credentials.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        setErrorMessage(getLoginErrorMessage(data));
        return;
      }

      if (!data.token || !data.user) {
        setErrorMessage("The login response was incomplete. Please try again.");
        return;
      }

      storeAuth(data.token, data.user);
      router.push("/dashboard");
    } catch {
      setErrorMessage(
        "Unable to reach the auth service. Please confirm it is running and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#111827]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-[#d8dee8] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#172033] text-sm font-semibold text-white">
              EC
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                {t.productName}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#64748b]">
                {t.adminWeb}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-4 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
          >
            {t.backToOverview}
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[0.92fr_1fr] lg:py-16">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex rounded-md border border-[#c9d3e2] bg-white px-3 py-1 text-sm font-medium text-[#334155] shadow-sm">
              Secure operations console
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#0f172a] sm:text-5xl">
              {t.productName}
            </h1>
            <p className="mt-4 text-2xl font-medium text-[#1f3a5f]">
              Admin Web Access
            </p>
            <p className="mt-6 text-base leading-7 text-[#475569]">
              Access is controlled by enterprise administrators. Use your
              assigned credentials to enter the protected admin workspace.
            </p>
          </div>

          <div className="w-full max-w-md justify-self-center rounded-lg border border-[#cbd5e1] bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.10)] sm:p-8 lg:justify-self-end">
            <div className="border-b border-[#e2e8f0] pb-5">
              <p className="text-sm font-semibold text-[#0f172a]">
                Sign in to admin
              </p>
              <p className="mt-1 text-sm text-[#64748b]">
                Enterprise-controlled access portal
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {errorMessage ? (
                <div
                  aria-live="polite"
                  className="rounded-md border border-[#f1b8b8] bg-[#fff5f5] px-4 py-3 text-sm leading-6 text-[#9b2c2c]"
                >
                  {errorMessage}
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#334155]"
                >
                  Email
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
                  className="mt-2 block h-12 w-full rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#334155]"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  className="mt-2 block h-12 w-full rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#172033] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#24324d] focus:outline-none focus:ring-2 focus:ring-[#172033] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#526174]"
              >
                {isSubmitting ? "Signing in..." : t.signIn}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
