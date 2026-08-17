"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { defaultMessages as t } from "@/lib/i18n/messages";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Users",
    href: "/users",
  },
  {
    label: "Roles",
    href: "#",
  },
  {
    label: "Settings",
    href: "#",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[#d8dee8] bg-[#101827] text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5 lg:px-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-sm font-semibold text-[#101827]">
            EC
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{t.productName}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-[#a7b3c7]">
              {t.adminWeb}
            </p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-col lg:overflow-visible lg:px-4 lg:py-6">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`inline-flex h-10 shrink-0 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-white text-[#101827] shadow-sm"
                  : "text-[#cbd5e1] hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
