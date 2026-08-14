"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  clearStoredAuth,
  getStoredToken,
  getStoredUserJson,
  parseStoredUser,
  subscribeToAuthStorage,
} from "@/lib/auth-storage";

export default function DashboardPage() {
  const router = useRouter();
  const token = useSyncExternalStore(
    subscribeToAuthStorage,
    getStoredToken,
    () => null,
  );
  const storedUserJson = useSyncExternalStore(
    subscribeToAuthStorage,
    getStoredUserJson,
    () => null,
  );
  const user = useMemo(
    () => parseStoredUser(storedUserJson),
    [storedUserJson],
  );

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  function handleLogout() {
    clearStoredAuth();
    router.push("/login");
  }

  const welcomeName = user?.name || user?.email || "administrator";

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
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-4 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
          >
            Logout
          </button>
        </header>

        <div className="flex flex-1 items-center py-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-md border border-[#c9d3e2] bg-white px-3 py-1 text-sm font-medium text-[#334155] shadow-sm">
              Enterprise Core
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#0f172a] sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-5 text-xl font-medium text-[#1f3a5f]">
              {token ? `Welcome, ${welcomeName}.` : "Checking access..."}
            </p>
            <p className="mt-6 text-base leading-7 text-[#475569]">
              Protected admin workspace placeholder.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
