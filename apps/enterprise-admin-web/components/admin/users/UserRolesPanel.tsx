"use client";

import { StatusMessage } from "@/components/admin/StatusMessage";
import { useI18n } from "@/lib/i18n/use-i18n";
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
  onClearAssignErrorMessages: () => void;
  onClearAssignSuccessMessage: () => void;
  onClearErrorMessage: () => void;
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
  onClearAssignErrorMessages,
  onClearAssignSuccessMessage,
  onClearErrorMessage,
  onRemoveRole,
  onClose,
}: UserRolesPanelProps) {
  const { messages: t } = useI18n();

  if (!user) {
    return null;
  }

  const assignedRoleIds = new Set(roles.map((role) => role.id));
  const assignableRoles = availableRoles.filter(
    (role) => role.is_active && !assignedRoleIds.has(role.id),
  );

  return (
    <section className="app-form-panel border-b px-5 py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="app-text text-base font-semibold">
            {t.userRoles}
          </h3>
          <p className="app-muted mt-1 text-sm">
            <span className="app-text font-medium">{user.name}</span>
            <span className="app-subtle mx-2">/</span>
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading || isAssigningRole || removingRoleId !== null}
          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
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
        <StatusMessage
          variant="error"
          className="mt-5"
          dismissible
          onDismiss={onClearErrorMessage}
        >
          {errorMessage}
        </StatusMessage>
      ) : null}

      {!isLoading && !errorMessage ? (
        <div className="app-card mt-5 rounded-md border p-4 shadow-sm">
          <h4 className="app-text text-sm font-semibold">
            {t.assignRole}
          </h4>

          {assignErrorMessages.length > 0 ? (
            <StatusMessage
              variant="error"
              className="mt-4"
              dismissible
              onDismiss={onClearAssignErrorMessages}
            >
              {assignErrorMessages.join(" ")}
            </StatusMessage>
          ) : null}

          {assignSuccessMessage ? (
            <StatusMessage
              variant="success"
              className="mt-4"
              dismissible
              autoDismiss
              onDismiss={onClearAssignSuccessMessage}
            >
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
                  className="app-muted block text-sm font-medium"
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
                  className="app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed"
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
                className="app-button-primary inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
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
              className="app-card rounded-md border p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="app-text text-sm font-semibold">
                    {role.name}
                  </h4>
                  <p className="app-subtle mt-1 text-xs font-medium">
                    {t.roleSlug}:{" "}
                    <span className="app-muted font-semibold">
                      {role.slug}
                    </span>
                  </p>
                </div>
                <span
                  className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${
                    role.is_active
                      ? "app-badge-success"
                      : "app-badge-neutral"
                  }`}
                >
                  {t.roleStatus}: {role.is_active ? t.active : t.inactive}
                </span>
              </div>

              {role.description ? (
                <p className="app-muted mt-3 text-sm leading-6">
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
                  className="app-danger-button inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-error-text)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-[var(--app-border)] disabled:bg-[var(--app-surface-muted)] disabled:text-[var(--app-text-subtle)]"
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
