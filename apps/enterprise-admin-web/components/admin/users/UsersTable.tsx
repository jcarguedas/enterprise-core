import { EnterpriseUser } from "@/lib/users-api";

type UsersTableProps = {
  users: EnterpriseUser[];
};

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#e2e8f0] text-left text-sm">
        <thead className="bg-[#f8fafc] text-xs font-semibold uppercase text-[#64748b]">
          <tr>
            <th scope="col" className="px-5 py-3">
              ID
            </th>
            <th scope="col" className="px-5 py-3">
              Name
            </th>
            <th scope="col" className="px-5 py-3">
              Email
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
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-5 py-6 text-center text-sm text-[#64748b]"
              >
                No users were returned by the API.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
