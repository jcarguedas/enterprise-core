import { StatusMessage } from "@/components/admin/StatusMessage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import type { EnterpriseRole, EnterpriseUser } from "@/lib/users-api";

type UserRolesPanelProps = {
  user: EnterpriseUser | null;
  roles: EnterpriseRole[];
  availableRoles: EnterpriseRole[];
  selectedRoleId: string;
  isLoading: boolean;
  isAssigningRole: boolean;
  removingRoleId: number | null;
  errorMessage: string;
  assignErrorMessages: string[];
  assignSuccessMessage: string;
  onSelectedRoleIdChange: (roleId: string) => void;
  onAssignRole: () => void;
  onRemoveRole: (roleId: number) => void;
  onClose: () => void;
};

export function UserRolesPanel({
  user,
  roles,
  availableRoles,
  selectedRoleId,
  isLoading,
  isAssigningRole,
  removingRoleId,
  errorMessage,
  assignErrorMessages,
  assignSuccessMessage,
  onSelectedRoleIdChange,
  onAssignRole,
  onRemoveRole,
  onClose,
}: UserRolesPanelProps) {
  if (!user) {
    return null;
  }

  const assignedRoleIds = new Set(roles.map((role) => role.id));
  const assignableRoles = availableRoles.filter(
    (role) => role.is_active && !assignedRoleIds.has(role.id),
  );

  return (
    <section className="border-b border-[#e2e8f0] bg-[#fbfcfe] px-5 py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#0f172a]">
            {t.userRoles}
          </h3>
          <p className="mt-1 text-sm text-[#475569]">
            <span className="font-medium text-[#172033]">{user.name}</span>
            <span className="mx-2 text-[#94a3b8]">/</span>
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading || isAssigningRole || removingRoleId !== null}
          className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-4 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
        >
          {t.close}
        </button>
      </div>

      {isLoading ? (
        <StatusMessage variant="info" className="mt-5">
          {t.loadingRoles}
        </StatusMessage>
      ) : null}

      {!isLoading && errorMessage ? (
        <StatusMessage variant="error" className="mt-5">
          {errorMessage}
        </StatusMessage>
      ) : null}

      {!isLoading && !errorMessage ? (
        <div className="mt-5 rounded-md border border-[#d8dee8] bg-white p-4">
          <h4 className="text-sm font-semibold text-[#0f172a]">
            {t.assignRole}
          </h4>

          {assignErrorMessages.length > 0 ? (
            <StatusMessage variant="error" className="mt-4">
              {assignErrorMessages.join(" ")}
            </StatusMessage>
          ) : null}

          {assignSuccessMessage ? (
            <StatusMessage variant="success" className="mt-4">
              {assignSuccessMessage}
            </StatusMessage>
          ) : null}

          {assignableRoles.length === 0 ? (
            <StatusMessage variant="info" className="mt-4">
              {t.noAvailableRoles}
            </StatusMessage>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <label
                  htmlFor="assign-user-role"
                  className="block text-sm font-medium text-[#334155]"
                >
                  {t.availableRoles}
                </label>
                <select
                  id="assign-user-role"
                  value={selectedRoleId}
                  onChange={(event) =>
                    onSelectedRoleIdChange(event.target.value)
                  }
                  disabled={
                    isLoading || isAssigningRole || removingRoleId !== null
                  }
                  className="mt-2 block h-11 w-full rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15 disabled:cursor-not-allowed disabled:bg-[#eef2f7]"
                >
                  <option value="">{t.selectRole}</option>
                  {assignableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={onAssignRole}
                disabled={
                  isLoading ||
                  isAssigningRole ||
                  removingRoleId !== null ||
                  !selectedRoleId
                }
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#172033] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#24324d] focus:outline-none focus:ring-2 focus:ring-[#172033] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#526174]"
              >
                {isAssigningRole ? t.assigningRole : t.assignRole}
              </button>
            </div>
          )}
        </div>
      ) : null}

      {!isLoading && !errorMessage && roles.length === 0 ? (
        <StatusMessage variant="info" className="mt-5">
          {t.noRolesAssigned}
        </StatusMessage>
      ) : null}

      {!isLoading && !errorMessage && roles.length > 0 ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.id}
              className="rounded-md border border-[#d8dee8] bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#0f172a]">
                    {role.name}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-[#64748b]">
                    {t.roleSlug}:{" "}
                    <span className="font-semibold text-[#334155]">
                      {role.slug}
                    </span>
                  </p>
                </div>
                <span
                  className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${
                    role.is_active
                      ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                      : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]"
                  }`}
                >
                  {t.roleStatus}: {role.is_active ? t.active : t.inactive}
                </span>
              </div>

              {role.description ? (
                <p className="mt-3 text-sm leading-6 text-[#475569]">
                  {role.description}
                </p>
              ) : null}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onRemoveRole(role.id)}
                  disabled={
                    isLoading ||
                    isAssigningRole ||
                    (removingRoleId !== null && removingRoleId !== role.id)
                  }
                  className="inline-flex h-9 items-center justify-center rounded-md border border-[#f1b8b8] bg-white px-3 text-xs font-semibold text-[#9b2c2c] shadow-sm transition-colors hover:bg-[#fff5f5] focus:outline-none focus:ring-2 focus:ring-[#9b2c2c] focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#e2e8f0] disabled:bg-[#eef2f7] disabled:text-[#64748b]"
                >
                  {removingRoleId === role.id ? t.removingRole : t.removeRole}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
