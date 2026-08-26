"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  hasPermission,
  MANAGE_USERS_PERMISSION,
  VIEW_SYSTEM_EVENTS_PERMISSION,
} from "@/lib/permissions";

type CommandItem = {
  aliases: {
    en: string[];
    es: string[];
  };
  href: string;
  icon: ComponentType<{ className?: string }>;
  labelKey: keyof Pick<
    SharedMessages,
    | "createUser"
    | "dashboard"
    | "roles"
    | "settings"
    | "system"
    | "systemEvents"
    | "users"
  >;
  permission?: string;
};

type VisibleCommand = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  searchValues: string[];
};

const commandItems: CommandItem[] = [
  {
    aliases: {
      en: ["dashboard", "home", "open dashboard"],
      es: ["inicio", "abrir dashboard"],
    },
    href: "/dashboard",
    icon: DashboardIcon,
    labelKey: "dashboard",
  },
  {
    aliases: {
      en: ["users"],
      es: [
        "usuarios",
        "abrir usuarios",
        "gestionar usuarios",
        "administrar usuarios",
      ],
    },
    href: "/users",
    icon: UsersIcon,
    labelKey: "users",
    permission: MANAGE_USERS_PERMISSION,
  },
  {
    aliases: {
      en: ["roles"],
      es: ["permisos", "abrir roles", "ver roles"],
    },
    href: "/roles",
    icon: RolesIcon,
    labelKey: "roles",
    permission: MANAGE_USERS_PERMISSION,
  },
  {
    aliases: {
      en: ["system"],
      es: ["sistema", "abrir sistema", "informacion del sistema"],
    },
    href: "/system",
    icon: SystemIcon,
    labelKey: "system",
  },
  {
    aliases: {
      en: ["system events", "activity log", "audit log"],
      es: [
        "eventos del sistema",
        "actividad del sistema",
        "auditoria",
        "auditoría",
      ],
    },
    href: "/system/events",
    icon: SystemIcon,
    labelKey: "systemEvents",
    permission: VIEW_SYSTEM_EVENTS_PERMISSION,
  },
  {
    aliases: {
      en: ["settings"],
      es: ["configuracion", "preferencias", "abrir configuracion"],
    },
    href: "/settings",
    icon: SettingsIcon,
    labelKey: "settings",
  },
  {
    aliases: {
      en: ["create user", "new user", "add user"],
      es: ["crear usuario", "nuevo usuario", "agregar usuario"],
    },
    href: "/users?intent=create-user",
    icon: UsersIcon,
    labelKey: "createUser",
    permission: MANAGE_USERS_PERMISSION,
  },
];

type CommandPaletteProps = {
  trustedUser: StoredUser | null;
};

function getShortcutHint() {
  if (typeof navigator === "undefined") {
    return "Ctrl K";
  }

  return navigator.platform.toLowerCase().includes("mac") ? "\u2318 K" : "Ctrl K";
}

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

const userSearchPrefixes = [
  "search user",
  "find user",
  "user",
  "buscar usuario",
  "ver usuario",
  "usuario",
];

const editUserPrefixes = [
  "edit user",
  "update user",
  "editar usuario",
  "actualizar usuario",
];

function parsePrefixedTerm(value: string, prefixes: string[]) {
  const normalizedValue = normalizeSearchValue(value.trim()).replace(
    /\s+/g,
    " ",
  );
  const matchedPrefix = prefixes.find(
    (prefix) =>
      normalizedValue === prefix || normalizedValue.startsWith(`${prefix} `),
  );

  if (!matchedPrefix) {
    return "";
  }

  const searchTerm = value.trim().slice(matchedPrefix.length).trim();

  return searchTerm.replace(/\s+/g, " ");
}

function parseUserSearchTerm(value: string) {
  return parsePrefixedTerm(value, userSearchPrefixes);
}

function parseEditUserTerm(value: string) {
  return parsePrefixedTerm(value, editUserPrefixes);
}

export function CommandPalette({ trustedUser }: CommandPaletteProps) {
  const router = useRouter();
  const { messages: t } = useI18n();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [shortcutHint] = useState(getShortcutHint);
  const canManageUsers = hasPermission(trustedUser, MANAGE_USERS_PERMISSION);
  const visibleCommands = useMemo(
    () => {
      const staticCommands = commandItems
        .filter(
          (command) =>
            !command.permission ||
            hasPermission(trustedUser, command.permission),
        )
        .map((command) => ({
          href: command.href,
          icon: command.icon,
          label: t[command.labelKey],
          searchValues: [
            t[command.labelKey],
            command.href,
            ...command.aliases.en,
            ...command.aliases.es,
          ],
        }));
      const editUserTerm = parseEditUserTerm(query);
      const userSearchTerm = parseUserSearchTerm(query);

      if (canManageUsers && editUserTerm.length >= 2) {
        staticCommands.unshift({
          href: `/users?intent=edit-user&search=${encodeURIComponent(
            editUserTerm,
          )}`,
          icon: UsersIcon,
          label: t.editUserFor.replace("{query}", editUserTerm),
          searchValues: [query, t.editUserCommand, t.editUserFor, editUserTerm],
        });
      }

      if (canManageUsers && userSearchTerm.length >= 2) {
        staticCommands.unshift({
          href: `/users?search=${encodeURIComponent(userSearchTerm)}`,
          icon: UsersIcon,
          label: t.searchUsersFor.replace("{query}", userSearchTerm),
          searchValues: [query, t.searchUser, t.searchUsersFor, userSearchTerm],
        });
      }

      return staticCommands;
    },
    [canManageUsers, query, t, trustedUser],
  );
  const filteredCommands = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query.trim());

    if (!normalizedQuery) {
      return visibleCommands;
    }

    return visibleCommands.filter((command) => {
      return command.searchValues.some((value) =>
        normalizeSearchValue(value).includes(normalizedQuery),
      );
    });
  }, [query, visibleCommands]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [isOpen]);

  function closePalette() {
    setQuery("");
    setIsOpen(false);
  }

  function selectCommand(href: string) {
    closePalette();
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="app-button-secondary inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
      >
        <span>{t.command}</span>
        <span
          suppressHydrationWarning
          className="app-subtle rounded border border-[var(--app-border)] px-1.5 py-0.5 text-[0.68rem] font-semibold leading-none"
        >
          {shortcutHint}
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 py-16"
          onClick={closePalette}
        >
          <section
            aria-describedby="command-palette-description"
            aria-labelledby="command-palette-title"
            aria-modal="true"
            className="app-card-lg w-full max-w-xl rounded-lg border shadow-xl"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="app-divider flex items-start justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2
                  id="command-palette-title"
                  className="app-text text-base font-semibold"
                >
                  {t.commandPalette}
                </h2>
                <p
                  id="command-palette-description"
                  className="app-subtle mt-1 text-sm"
                >
                  {t.commandPaletteDescription}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.closeCommandPalette}
                onClick={closePalette}
                className="app-button-secondary inline-flex size-8 shrink-0 items-center justify-center rounded-md border text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)]"
              >
                X
              </button>
            </div>

            <div className="p-5">
              <label htmlFor="command-palette-search" className="sr-only">
                {t.searchCommands}
              </label>
              <input
                id="command-palette-search"
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="app-input block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors"
                placeholder={t.searchCommands}
              />

              <div className="mt-4 overflow-hidden rounded-md border border-[var(--app-border)]">
                {filteredCommands.length > 0 ? (
                  <ul className="divide-y divide-[var(--app-border)]">
                    {filteredCommands.map((command: VisibleCommand) => {
                      const Icon = command.icon;

                      return (
                        <li key={command.href}>
                          <button
                            type="button"
                            onClick={() => selectCommand(command.href)}
                            className="app-button-secondary flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--app-focus)]"
                          >
                            <Icon className="size-4 shrink-0" />
                            <span>{command.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="app-muted px-4 py-5 text-center text-sm">
                    {t.noCommandsFound}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
