import { defaultMessages as t } from "@/lib/i18n/messages";
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
          className="inline-flex items-center gap-1 font-semibold uppercase text-[#64748b] transition-colors hover:text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
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
      <table className="min-w-full divide-y divide-[#e2e8f0] text-left text-sm">
        <thead className="bg-[#f8fafc] text-xs font-semibold uppercase text-[#64748b]">
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
        <tbody className="divide-y divide-[#edf2f7] bg-white">
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
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-[#334155]">
                    {user.id}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-[#0f172a]">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#475569]">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${
                        user.is_active
                          ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                          : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]"
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
                        className="inline-flex h-8 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-xs font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
                        aria-label={`${t.viewRoles}: ${user.name}`}
                      >
                        {t.viewRoles}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditUser(user)}
                        disabled={isActionsDisabled}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-xs font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
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
                        className="inline-flex h-8 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-xs font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
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
                className="px-5 py-6 text-center text-sm text-[#64748b]"
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
