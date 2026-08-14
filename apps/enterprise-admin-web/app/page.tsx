import Link from "next/link";

const capabilities = [
  {
    title: "User Management",
    description:
      "Administer enterprise-controlled identities, access status, and operator workflows from a focused web console.",
  },
  {
    title: "Role-Based Access Control",
    description:
      "Model roles, permissions, and administrative boundaries with clear visibility across protected operations.",
  },
  {
    title: "Modular Enterprise Platform",
    description:
      "Prepare the workspace for future business modules while keeping identity and governance at the core.",
  },
];

export default function Home() {
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
                Enterprise Core
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#64748b]">
                Admin Web
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-[#64748b] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#2f855a]" />
            Platform foundation
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-md border border-[#c9d3e2] bg-white px-3 py-1 text-sm font-medium text-[#334155] shadow-sm">
              Enterprise administration workspace
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal text-[#0f172a] sm:text-6xl">
              Enterprise Core
            </h1>
            <p className="mt-5 text-2xl font-medium text-[#1f3a5f]">
              Intelligent Business Operations Platform
            </p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#475569]">
              This admin web app will manage users, roles, permissions, and
              future enterprise modules from a secure, API-first operations
              console.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#172033] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#24324d] focus:outline-none focus:ring-2 focus:ring-[#172033] focus:ring-offset-2"
              >
                Go to Login
              </Link>
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-6 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
              >
                View Architecture
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-[#cbd5e1] bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
            <div className="mb-5 flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">
                  Operations Overview
                </p>
                <p className="text-xs text-[#64748b]">Identity and access</p>
              </div>
              <span className="rounded-md bg-[#e8f5ee] px-2.5 py-1 text-xs font-medium text-[#276749]">
                Ready
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Users", "Managed"],
                ["Roles", "Available"],
                ["Permissions", "Protected"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#64748b]">
                    {label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[#0f172a]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 overflow-hidden rounded-md border border-[#e2e8f0]">
              <div className="grid grid-cols-[1fr_0.8fr_0.7fr] bg-[#f1f5f9] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                <span>Module</span>
                <span>Scope</span>
                <span>Status</span>
              </div>
              {[
                ["Auth Service", "Core API", "Active"],
                ["RBAC", "Governance", "Active"],
                ["Modules", "Roadmap", "Planned"],
              ].map(([module, scope, status]) => (
                <div
                  key={module}
                  className="grid grid-cols-[1fr_0.8fr_0.7fr] border-t border-[#e2e8f0] px-4 py-4 text-sm"
                >
                  <span className="font-medium text-[#0f172a]">{module}</span>
                  <span className="text-[#64748b]">{scope}</span>
                  <span className="font-medium text-[#1f3a5f]">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className="rounded-lg border border-[#d8dee8] bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#0f172a]">
                {capability.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#526174]">
                {capability.description}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
