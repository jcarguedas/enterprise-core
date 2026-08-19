import { defaultMessages as t } from "@/lib/i18n/messages";
import type { EnterpriseUser } from "@/lib/users-api";

type UsersTableProps = {
  users: EnterpriseUser[];
  onEditUser: (user: EnterpriseUser) => void;
  onViewRoles: (user: EnterpriseUser) => void;
};

export function UsersTable({
  onEditUser,
  onViewRoles,
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
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onViewRoles(user)}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-xs font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
                      aria-label={`${t.viewRoles}: ${user.name}`}
                    >
                      {t.viewRoles}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditUser(user)}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-xs font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
                      aria-label={`${t.editUser}: ${user.name}`}
                    >
                      {t.edit}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
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
