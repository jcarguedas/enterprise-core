"use client";

import { useI18n } from "@/lib/i18n/use-i18n";
import type { EnterpriseUser } from "@/lib/users-api";

export type UserSortDirection = "asc" | "desc";
export type UserSortKey = "id" | "name" | "email" | "status";

type UsersTableProps = {
  users: EnterpriseUser[];
  currentUserId: number | null;
  emptyMessage: string;
  isActionsDisabled: boolean;
  sortDirection: UserSortDirection;
  sortKey: UserSortKey | null;
  updatingUserStatusId: number | null;
  onEditUser: (user: EnterpriseUser) => void;
  onSort: (sortKey: UserSortKey) => void;
  onToggleUserStatus: (user: EnterpriseUser) => void;
  onViewRoles: (user: EnterpriseUser) => void;
};

export function UsersTable({
  currentUserId,
  emptyMessage,
  isActionsDisabled,
  onEditUser,
  onSort,
  onToggleUserStatus,
  onViewRoles,
  sortDirection,
  sortKey,
  updatingUserStatusId,
  users,
}: UsersTableProps) {
  const { messages: t } = useI18n();

  function getSortIndicator(headerSortKey: UserSortKey) {
    if (sortKey !== headerSortKey) {
      return "";
    }

    return sortDirection === "asc" ? "↑" : "↓";
  }

  function getAriaSort(headerSortKey: UserSortKey) {
    if (sortKey !== headerSortKey) {
      return "none";
    }

    return sortDirection === "asc" ? "ascending" : "descending";
  }

  function getSortButtonLabel(headerSortKey: UserSortKey) {
    const labels = {
      id: t.sortById,
      name: t.sortByName,
      email: t.sortByEmail,
      status: t.sortByStatus,
    };

    return labels[headerSortKey];
  }

  function renderSortableHeader(headerSortKey: UserSortKey, label: string) {
    return (
      <th
        scope="col"
        className="px-5 py-3"
        aria-sort={getAriaSort(headerSortKey)}
      >
        <button
          type="button"
          onClick={() => onSort(headerSortKey)}
          className="app-subtle inline-flex items-center gap-1 font-semibold uppercase transition-colors hover:text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
          aria-label={getSortButtonLabel(headerSortKey)}
        >
          <span>{label}</span>
          <span aria-hidden="true" className="inline-block w-3 text-left">
            {getSortIndicator(headerSortKey)}
          </span>
        </button>
      </th>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--app-border)] text-left text-sm">
        <thead className="app-table-head text-xs font-semibold uppercase">
          <tr>
            {renderSortableHeader("id", t.id)}
            {renderSortableHeader("name", t.name)}
            {renderSortableHeader("email", t.email)}
            {renderSortableHeader("status", t.status)}
            <th scope="col" className="px-5 py-3">
              {t.actions}
            </th>
          </tr>
        </thead>
        <tbody className="app-table-body divide-y">
          {users.length > 0 ? (
            users.map((user) => {
              const isOwnActiveUser =
                currentUserId === user.id && user.is_active;
              const isStatusActionDisabled =
                isActionsDisabled || isOwnActiveUser;
              const statusActionLabel = user.is_active
                ? t.deactivateUser
                : t.reactivateUser;
              const statusActionAccessibleLabel = isOwnActiveUser
                ? t.cannotDeactivateOwnAccount
                : `${statusActionLabel}: ${user.name}`;

              return (
                <tr key={user.id}>
                  <td className="app-muted whitespace-nowrap px-5 py-4 font-medium">
                    {user.id}
                  </td>
                  <td className="app-text whitespace-nowrap px-5 py-4 font-medium">
                    {user.name}
                  </td>
                  <td className="app-muted whitespace-nowrap px-5 py-4">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${
                        user.is_active
                          ? "app-badge-success"
                          : "app-badge-neutral"
                      }`}
                    >
                      {user.is_active ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onViewRoles(user)}
                        disabled={isActionsDisabled}
                        className="app-button-secondary inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                        aria-label={`${t.viewRoles}: ${user.name}`}
                      >
                        {t.viewRoles}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditUser(user)}
                        disabled={isActionsDisabled}
                        className="app-button-secondary inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                        aria-label={`${t.editUser}: ${user.name}`}
                      >
                        {t.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleUserStatus(user)}
                        disabled={isStatusActionDisabled}
                        title={
                          isOwnActiveUser
                            ? t.cannotDeactivateOwnAccount
                            : undefined
                        }
                        className="app-button-secondary inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                        aria-label={statusActionAccessibleLabel}
                      >
                        {updatingUserStatusId === user.id
                          ? user.is_active
                            ? t.deactivatingUser
                            : t.reactivatingUser
                          : statusActionLabel}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={5}
                className="app-subtle px-5 py-6 text-center text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
