"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import {
  DashboardIcon,
  RolesIcon,
  SettingsIcon,
  SystemIcon,
  UsersIcon,
} from "@/components/icons";
import type { StoredUser } from "@/lib/auth-storage";
import type { SharedMessages } from "@/lib/i18n/messages";
import { useI18n } from "@/lib/i18n/use-i18n";
import { hasPermission, MANAGE_USERS_PERMISSION } from "@/lib/permissions";
import { productDisplayName } from "@/lib/product-info";

type NavigationItem = {
  labelKey: keyof Pick<
    SharedMessages,
    "dashboard" | "roles" | "settings" | "system" | "users"
  >;
  href: string;
  icon: ComponentType<{ className?: string }>;
  permission?: string;
};

const navigationItems: NavigationItem[] = [
  {
    labelKey: "dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    labelKey: "users",
    href: "/users",
    icon: UsersIcon,
    permission: MANAGE_USERS_PERMISSION,
  },
  {
    labelKey: "roles",
    href: "/roles",
    icon: RolesIcon,
    permission: MANAGE_USERS_PERMISSION,
  },
  {
    labelKey: "system",
    href: "/system",
    icon: SystemIcon,
  },
  {
    labelKey: "settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

type AdminSidebarProps = {
  trustedUser: StoredUser | null;
};

export function AdminSidebar({ trustedUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const { messages: t } = useI18n();
  const visibleNavigationItems = navigationItems.filter(
    (item) => !item.permission || hasPermission(trustedUser, item.permission),
  );

  return (
    <aside className="border-b border-[var(--app-border)] bg-[var(--app-sidebar-bg)] text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5 lg:px-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-sm font-semibold text-[#101827]">
            EC
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {productDisplayName}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-sidebar-muted)]">
              {t.adminWeb}
            </p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-col lg:overflow-visible lg:px-4 lg:py-6">
          {visibleNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.labelKey}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white text-[#101827] shadow-sm"
                    : "text-[var(--app-sidebar-text)] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{t[item.labelKey]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
