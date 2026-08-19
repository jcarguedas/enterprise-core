"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { CreateUserForm } from "@/components/admin/users/CreateUserForm";
import { EditUserForm } from "@/components/admin/users/EditUserForm";
import { UserRolesPanel } from "@/components/admin/users/UserRolesPanel";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { clearStoredAuth, getStoredToken } from "@/lib/auth-storage";
import { defaultMessages as t } from "@/lib/i18n/messages";
import { useCreateUser } from "@/lib/use-create-user";
import { useEditUser } from "@/lib/use-edit-user";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";
import { useUserRoles } from "@/lib/use-user-roles";
import { useUserStatus } from "@/lib/use-user-status";
import { getUsers } from "@/lib/users-api";
import type { EnterpriseUser } from "@/lib/users-api";

type UsersLoadStatus = "idle" | "loading" | "ready" | "error";

const usersSummaryCards = [
  {
    title: t.userDirectory,
    getDescription: (users: EnterpriseUser[]) =>
      `${users.length} enterprise account${users.length === 1 ? "" : "s"} available.`,
  },
  {
    title: t.roleAssignments,
    getDescription: () => t.roleAssignmentsDescription,
  },
  {
    title: t.accessStatus,
    getDescription: () => t.accessStatusDescription,
  },
];

export default function UsersPage() {
  const router = useRouter();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    userDisplayName,
  } = useProtectedAdminSession();
  const [users, setUsers] = useState<EnterpriseUser[]>([]);
  const [usersStatus, setUsersStatus] = useState<UsersLoadStatus>("idle");
  const [usersErrorMessage, setUsersErrorMessage] = useState("");
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);
  const createUserFlow = useCreateUser({
    onUserCreated: (createdUser) => {
      setUsers((currentUsers) => {
        const existingUserIndex = currentUsers.findIndex(
          (user) => user.id === createdUser.id,
        );

        if (existingUserIndex === -1) {
          return [createdUser, ...currentUsers];
        }

        return currentUsers.map((user) =>
          user.id === createdUser.id ? createdUser : user,
        );
      });
      setUsersStatus("ready");
    },
    onUnauthorized: () => {
      clearStoredAuth();
      router.replace("/login");
    },
  });
  const editUserFlow = useEditUser({
    onUserUpdated: (updatedUser) => {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
      );
    },
    onUnauthorized: () => {
      clearStoredAuth();
      router.replace("/login");
    },
  });
  const userRolesFlow = useUserRoles({
    onUnauthorized: () => {
      clearStoredAuth();
      router.replace("/login");
    },
  });
  const userStatusFlow = useUserStatus({
    onUserUpdated: (updatedUser) => {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
      );
    },
    onUnauthorized: () => {
      clearStoredAuth();
      router.replace("/login");
    },
  });
  const isUserRolesBusy =
    userRolesFlow.isLoading ||
    userRolesFlow.isAssigningRole ||
    userRolesFlow.removingRoleId !== null;
  const isUserStatusUpdating = userStatusFlow.updatingUserStatusId !== null;

  const loadUsers = useCallback(
    async (
      currentToken: string,
      options: {
        isRefresh?: boolean;
        shouldApplyResult?: () => boolean;
      } = {},
    ) => {
      const { isRefresh = false, shouldApplyResult = () => true } = options;

      setUsersStatus("loading");
      setUsersErrorMessage("");

      if (isRefresh) {
        setIsRefreshingUsers(true);
      }

      const result = await getUsers(currentToken);

      if (!shouldApplyResult()) {
        return;
      }

      if (isRefresh) {
        setIsRefreshingUsers(false);
      }

      if (result.status === "success") {
        setUsers(result.users);
        setUsersStatus("ready");
        return;
      }

      if (result.status === "unauthorized") {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setUsers([]);
      setUsersErrorMessage(result.message);
      setUsersStatus("error");
    },
    [router],
  );

  const refreshUsers = useCallback(() => {
    const token = getStoredToken();

    if (!token) {
      clearStoredAuth();
      router.replace("/login");
      return;
    }

    loadUsers(token, { isRefresh: true });
  }, [loadUsers, router]);

  function handleShowCreateUserForm() {
    if (
      createUserFlow.isSubmitting ||
      editUserFlow.isSubmitting ||
      isUserStatusUpdating
    ) {
      return;
    }

    userStatusFlow.clearMessages();
    editUserFlow.cancelEditing();
    userRolesFlow.closeRolesPanel();
    createUserFlow.showForm();
  }

  function handleEditUser(user: EnterpriseUser) {
    if (
      createUserFlow.isSubmitting ||
      editUserFlow.isSubmitting ||
      isUserStatusUpdating
    ) {
      return;
    }

    userStatusFlow.clearMessages();
    createUserFlow.cancelForm();
    userRolesFlow.closeRolesPanel();
    editUserFlow.startEditingUser(user);
  }

  function handleViewRoles(user: EnterpriseUser) {
    if (
      createUserFlow.isSubmitting ||
      editUserFlow.isSubmitting ||
      isUserStatusUpdating
    ) {
      return;
    }

    userStatusFlow.clearMessages();
    createUserFlow.cancelForm();
    editUserFlow.cancelEditing();
    userRolesFlow.showRolesForUser(user);
  }

  function handleToggleUserStatus(user: EnterpriseUser) {
    if (
      createUserFlow.isSubmitting ||
      editUserFlow.isSubmitting ||
      isUserRolesBusy ||
      isUserStatusUpdating
    ) {
      return;
    }

    userStatusFlow.updateUserStatus(user);
  }

  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    let isCurrent = true;
    const token = getStoredToken();

    if (!token) {
      clearStoredAuth();
      router.replace("/login");
      return;
    }

    Promise.resolve().then(() => {
      if (!isCurrent) {
        return;
      }

      loadUsers(token, { shouldApplyResult: () => isCurrent });
    });

    return () => {
      isCurrent = false;
    };
  }, [loadUsers, router, status]);

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      isLoggingOut={isLoggingOut}
      onLogout={logout}
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow={t.productName}
          title={t.users}
          description={t.usersDescription}
        />

        {status === "checking" ? (
          <StatusMessage variant="info" className="mt-6">
            {t.validatingSession}
          </StatusMessage>
        ) : null}

        {status === "error" ? (
          <StatusMessage variant="error" className="mt-6">
            {errorMessage}
          </StatusMessage>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {usersSummaryCards.map((card) => (
            <SummaryCard
              key={card.title}
              title={card.title}
              description={card.getDescription(users)}
            />
          ))}
        </div>

        <section className="mt-6 rounded-lg border border-[#d8dee8] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-2 border-b border-[#e2e8f0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0f172a]">
                {t.userDirectory}
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                {t.userDirectoryDescription}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={refreshUsers}
                disabled={
                  usersStatus === "loading" ||
                  createUserFlow.isSubmitting ||
                  editUserFlow.isSubmitting ||
                  isUserStatusUpdating
                }
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-4 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
              >
                {t.refresh}
              </button>
              <button
                type="button"
                onClick={handleShowCreateUserForm}
                disabled={
                  createUserFlow.isFormVisible ||
                  createUserFlow.isSubmitting ||
                  editUserFlow.isSubmitting ||
                  isUserStatusUpdating
                }
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#172033] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#24324d] focus:outline-none focus:ring-2 focus:ring-[#172033] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#526174]"
                aria-label={t.showCreateUserForm}
              >
                {t.createUser}
              </button>
            </div>
          </div>

          {createUserFlow.successMessage ? (
            <StatusMessage variant="success" className="m-5">
              {createUserFlow.successMessage}
            </StatusMessage>
          ) : null}

          {editUserFlow.successMessage ? (
            <StatusMessage variant="success" className="m-5">
              {editUserFlow.successMessage}
            </StatusMessage>
          ) : null}

          {userStatusFlow.successMessage ? (
            <StatusMessage variant="success" className="m-5">
              {userStatusFlow.successMessage}
            </StatusMessage>
          ) : null}

          {userStatusFlow.errorMessages.length > 0 ? (
            <StatusMessage variant="error" className="m-5">
              {userStatusFlow.errorMessages.join(" ")}
            </StatusMessage>
          ) : null}

          {createUserFlow.isFormVisible ? (
            <CreateUserForm
              name={createUserFlow.name}
              email={createUserFlow.email}
              password={createUserFlow.password}
              passwordConfirmation={createUserFlow.passwordConfirmation}
              isSubmitting={createUserFlow.isSubmitting}
              errorMessages={createUserFlow.errorMessages}
              onNameChange={createUserFlow.setName}
              onEmailChange={createUserFlow.setEmail}
              onPasswordChange={createUserFlow.setPassword}
              onPasswordConfirmationChange={
                createUserFlow.setPasswordConfirmation
              }
              onSubmit={createUserFlow.submit}
              onCancel={createUserFlow.cancelForm}
            />
          ) : null}

          {editUserFlow.isFormVisible ? (
            <EditUserForm
              name={editUserFlow.name}
              email={editUserFlow.email}
              isSubmitting={editUserFlow.isSubmitting}
              errorMessages={editUserFlow.errorMessages}
              onNameChange={editUserFlow.setName}
              onEmailChange={editUserFlow.setEmail}
              onSubmit={editUserFlow.submit}
              onCancel={editUserFlow.cancelEditing}
            />
          ) : null}

          {userRolesFlow.isVisible ? (
            <UserRolesPanel
              user={userRolesFlow.selectedUser}
              roles={userRolesFlow.roles}
              availableRoles={userRolesFlow.availableRoles}
              selectedRoleId={userRolesFlow.selectedRoleId}
              isLoading={userRolesFlow.isLoading}
              isAssigningRole={userRolesFlow.isAssigningRole}
              removingRoleId={userRolesFlow.removingRoleId}
              errorMessage={userRolesFlow.errorMessage}
              assignErrorMessages={userRolesFlow.assignErrorMessages}
              assignSuccessMessage={userRolesFlow.assignSuccessMessage}
              onSelectedRoleIdChange={userRolesFlow.setSelectedRoleId}
              onAssignRole={userRolesFlow.assignSelectedRole}
              onRemoveRole={userRolesFlow.removeRole}
              onClose={userRolesFlow.closeRolesPanel}
            />
          ) : null}

          {usersStatus === "loading" ? (
            <StatusMessage variant="info" className="px-5 py-5">
              {isRefreshingUsers ? t.refreshingUsers : t.loadingUsers}
            </StatusMessage>
          ) : null}

          {usersStatus === "error" ? (
            <StatusMessage variant="error" className="m-5">
              {usersErrorMessage}
            </StatusMessage>
          ) : null}

          {usersStatus === "ready" ? (
            <UsersTable
              users={users}
              isActionsDisabled={
                createUserFlow.isSubmitting ||
                editUserFlow.isSubmitting ||
                isUserRolesBusy ||
                isUserStatusUpdating
              }
              updatingUserStatusId={userStatusFlow.updatingUserStatusId}
              onEditUser={handleEditUser}
              onToggleUserStatus={handleToggleUserStatus}
              onViewRoles={handleViewRoles}
            />
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
