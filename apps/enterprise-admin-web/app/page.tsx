"use client";

import Link from "next/link";

import { LanguageSelector } from "@/components/admin/LanguageSelector";
import { ThemeSelector } from "@/components/admin/ThemeSelector";
import { useI18n } from "@/lib/i18n/use-i18n";
import { productDisplayName } from "@/lib/product-info";

export default function Home() {
  const { messages: t } = useI18n();
  const capabilities = [
    {
      title: t.capabilityUserManagementTitle,
      description: t.capabilityUserManagementDescription,
    },
    {
      title: t.capabilityRbacTitle,
      description: t.capabilityRbacDescription,
    },
    {
      title: t.capabilityPlatformTitle,
      description: t.capabilityPlatformDescription,
    },
  ];
  const overviewMetrics = [
    [t.users, t.managed],
    [t.roles, t.available],
    [t.permissions, t.protected],
  ];
  const moduleRows = [
    ["Auth Service", t.coreApi, t.active],
    [t.rbac, t.governance, t.active],
    [t.modules, t.roadmap, t.planned],
  ];

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
          <div className="flex flex-wrap items-center justify-end gap-4">
            <div className="app-subtle hidden items-center gap-2 text-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#2f855a]" />
              {t.platformFoundation}
            </div>
            <LanguageSelector />
            <ThemeSelector />
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="app-button-secondary mb-5 inline-flex rounded-md border px-3 py-1 text-sm font-medium shadow-sm">
              {t.landingEyebrow}
            </p>
            <h1 className="app-text text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
              {productDisplayName}
            </h1>
            <p className="app-muted mt-5 text-2xl font-medium">
              {t.landingSubtitle}
            </p>
            <p className="app-muted mt-6 max-w-xl text-lg leading-8">
              {t.landingDescription}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="app-button-primary inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
              >
                {t.goToLogin}
              </Link>
              <a
                href="#"
                className="app-button-secondary inline-flex h-12 items-center justify-center rounded-md border px-6 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
              >
                {t.viewArchitecture}
              </a>
            </div>
          </div>

          <div className="app-card-lg rounded-lg border p-5">
            <div className="app-divider mb-5 flex items-center justify-between border-b pb-4">
              <div>
                <p className="app-text text-sm font-semibold">
                  {t.operationsOverview}
                </p>
                <p className="app-subtle text-xs">
                  {t.identityAndAccess}
                </p>
              </div>
              <span className="app-badge-success rounded-md border px-2.5 py-1 text-xs font-medium">
                {t.ready}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {overviewMetrics.map(([label, value]) => (
                <div
                  key={label}
                  className="app-panel rounded-md border p-4"
                >
                  <p className="app-subtle text-xs font-medium uppercase tracking-[0.14em]">
                    {label}
                  </p>
                  <p className="app-text mt-3 text-2xl font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="app-divider mt-5 overflow-hidden rounded-md border">
              <div className="app-table-head grid grid-cols-[1fr_0.8fr_0.7fr] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]">
                <span>{t.module}</span>
                <span>{t.scope}</span>
                <span>{t.status}</span>
              </div>
              {moduleRows.map(([module, scope, status]) => (
                <div
                  key={module}
                  className="app-divider grid grid-cols-[1fr_0.8fr_0.7fr] border-t px-4 py-4 text-sm"
                >
                  <span className="app-text font-medium">{module}</span>
                  <span className="app-subtle">{scope}</span>
                  <span className="app-muted font-medium">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className="app-card rounded-lg border p-6 shadow-sm"
            >
              <h2 className="app-text text-lg font-semibold">
                {capability.title}
              </h2>
              <p className="app-muted mt-3 text-sm leading-6">
                {capability.description}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
