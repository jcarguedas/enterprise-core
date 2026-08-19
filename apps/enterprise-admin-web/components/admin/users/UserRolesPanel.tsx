import { StatusMessage } from "@/components/admin/StatusMessage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import type { EnterpriseRole, EnterpriseUser } from "@/lib/users-api";

type UserRolesPanelProps = {
  user: EnterpriseUser | null;
  roles: EnterpriseRole[];
  isLoading: boolean;
  errorMessage: string;
  onClose: () => void;
};

export function UserRolesPanel({
  user,
  roles,
  isLoading,
  errorMessage,
  onClose,
}: UserRolesPanelProps) {
  if (!user) {
    return null;
  }

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
          disabled={isLoading}
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
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
