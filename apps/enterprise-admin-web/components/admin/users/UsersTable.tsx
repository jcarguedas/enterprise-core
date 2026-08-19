import { defaultMessages as t } from "@/lib/i18n/messages";
import type { EnterpriseUser } from "@/lib/users-api";

type UsersTableProps = {
  users: EnterpriseUser[];
  isActionsDisabled: boolean;
  updatingUserStatusId: number | null;
  onEditUser: (user: EnterpriseUser) => void;
  onToggleUserStatus: (user: EnterpriseUser) => void;
  onViewRoles: (user: EnterpriseUser) => void;
};

export function UsersTable({
  isActionsDisabled,
  onEditUser,
  onToggleUserStatus,
  onViewRoles,
  updatingUserStatusId,
  users,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#e2e8f0] text-left text-sm">
        <thead className="bg-[#f8fafc] text-xs font-semibold uppercase text-[#64748b]">
          <tr>
            <th scope="col" className="px-5 py-3">
              {t.id}
            </th>
            <th scope="col" className="px-5 py-3">
              {t.name}
            </th>
            <th scope="col" className="px-5 py-3">
              {t.email}
            </th>
            <th scope="col" className="px-5 py-3">
              {t.status}
            </th>
            <th scope="col" className="px-5 py-3">
              {t.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#edf2f7] bg-white">
          {users.length > 0 ? (
            users.map((user) => (
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
                      disabled={isActionsDisabled}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-xs font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
                      aria-label={`${
                        user.is_active ? t.deactivateUser : t.reactivateUser
                      }: ${user.name}`}
                    >
                      {updatingUserStatusId === user.id
                        ? user.is_active
                          ? t.deactivatingUser
                          : t.reactivatingUser
                        : user.is_active
                          ? t.deactivateUser
                          : t.reactivateUser}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="px-5 py-6 text-center text-sm text-[#64748b]"
              >
                {t.noUsersReturned}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
