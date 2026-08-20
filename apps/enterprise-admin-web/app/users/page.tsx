"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { CreateUserForm } from "@/components/admin/users/CreateUserForm";
import { EditUserForm } from "@/components/admin/users/EditUserForm";
import { UserRolesPanel } from "@/components/admin/users/UserRolesPanel";
import { UsersTable } from "@/components/admin/users/UsersTable";
import type {
  UserSortDirection,
  UserSortKey,
} from "@/components/admin/users/UsersTable";
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

const PAGE_SIZE_OPTIONS = [5, 10, 25];

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
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();
  const [users, setUsers] = useState<EnterpriseUser[]>([]);
  const [usersStatus, setUsersStatus] = useState<UsersLoadStatus>("idle");
  const [usersErrorMessage, setUsersErrorMessage] = useState("");
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<UserSortKey | null>(null);
  const [sortDirection, setSortDirection] =
    useState<UserSortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const normalizedSearchQuery = searchQuery.trim().replace(/\s+/g, " ");
  const displayedUsers = useMemo(() => {
    const normalizedQuery = normalizedSearchQuery.toLowerCase();
    const filteredUsers = normalizedQuery
      ? users.filter((user) => {
          const statusLabel = user.is_active ? t.active : t.inactive;
          const searchableText = [
            user.id.toString(),
            user.name,
            user.email,
            statusLabel,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(normalizedQuery);
        })
      : users;

    if (!sortKey) {
      return filteredUsers;
    }

    return filteredUsers
      .map((user, index) => ({ index, user }))
      .sort((left, right) => {
        const sortMultiplier = sortDirection === "asc" ? 1 : -1;
        let comparison = 0;

        if (sortKey === "id") {
          comparison = left.user.id - right.user.id;
        }

        if (sortKey === "name") {
          comparison = left.user.name.localeCompare(right.user.name);
        }

        if (sortKey === "email") {
          comparison = left.user.email.localeCompare(right.user.email);
        }

        if (sortKey === "status") {
          const leftStatus = left.user.is_active ? t.active : t.inactive;
          const rightStatus = right.user.is_active ? t.active : t.inactive;
          comparison = leftStatus.localeCompare(rightStatus);
        }

        if (comparison === 0) {
          return left.index - right.index;
        }

        return comparison * sortMultiplier;
      })
      .map(({ user }) => user);
  }, [normalizedSearchQuery, sortDirection, sortKey, users]);
  const usersCountMessage = t.showingUsersCount
    .replace("{visible}", displayedUsers.length.toString())
    .replace("{total}", users.length.toString());
  const totalPages = Math.max(1, Math.ceil(displayedUsers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedUsers = displayedUsers.slice(
    pageStartIndex,
    pageStartIndex + pageSize,
  );
  const usersPageCountMessage = t.usersPageCount
    .replace("{current}", safeCurrentPage.toString())
    .replace("{total}", totalPages.toString());
  const usersEmptyMessage =
    users.length > 0 && normalizedSearchQuery
      ? t.noUsersMatchSearch
      : t.noUsersReturned;

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

  function handleSearchQueryChange(nextSearchQuery: string) {
    setSearchQuery(nextSearchQuery);
    setCurrentPage(1);
  }

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }

  function handleSort(nextSortKey: UserSortKey) {
    if (sortKey === nextSortKey) {
      setSortDirection((currentDirection) =>
        currentDirection === "asc" ? "desc" : "asc",
      );
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection("asc");
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
            <StatusMessage
              variant="success"
              className="m-5"
              dismissible
              autoDismiss
              onDismiss={createUserFlow.clearSuccessMessage}
            >
              {createUserFlow.successMessage}
            </StatusMessage>
          ) : null}

          {editUserFlow.successMessage ? (
            <StatusMessage
              variant="success"
              className="m-5"
              dismissible
              autoDismiss
              onDismiss={editUserFlow.clearSuccessMessage}
            >
              {editUserFlow.successMessage}
            </StatusMessage>
          ) : null}

          {userStatusFlow.successMessage ? (
            <StatusMessage
              variant="success"
              className="m-5"
              dismissible
              autoDismiss
              onDismiss={userStatusFlow.clearMessages}
            >
              {userStatusFlow.successMessage}
            </StatusMessage>
          ) : null}

          {userStatusFlow.errorMessages.length > 0 ? (
            <StatusMessage
              variant="error"
              className="m-5"
              dismissible
              onDismiss={userStatusFlow.clearMessages}
            >
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
              onClearErrorMessages={createUserFlow.clearErrorMessages}
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
              onClearErrorMessages={editUserFlow.clearErrorMessages}
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
              onClearAssignErrorMessages={
                userRolesFlow.clearAssignErrorMessages
              }
              onClearAssignSuccessMessage={
                userRolesFlow.clearAssignSuccessMessage
              }
              onClearErrorMessage={userRolesFlow.clearErrorMessage}
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
            <>
              <div className="border-b border-[#e2e8f0] px-5 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="users-search"
                      className="block text-sm font-medium text-[#334155]"
                    >
                      {t.searchUsers}
                    </label>
                    <div className="mt-2 flex max-w-xl gap-2">
                      <input
                        id="users-search"
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                          handleSearchQueryChange(event.target.value)
                        }
                        placeholder={t.searchUsersPlaceholder}
                        className="block h-10 min-w-0 flex-1 rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15"
                      />
                      {searchQuery ? (
                        <button
                          type="button"
                          onClick={() => handleSearchQueryChange("")}
                          className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2"
                          aria-label={t.clearSearch}
                        >
                          {t.clearSearch}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    <p className="text-sm font-medium text-[#64748b]">
                      {usersCountMessage}
                    </p>
                    {displayedUsers.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="users-page-size"
                          className="text-sm font-medium text-[#334155]"
                        >
                          {t.usersPerPage}
                        </label>
                        <select
                          id="users-page-size"
                          value={pageSize}
                          onChange={(event) =>
                            handlePageSizeChange(Number(event.target.value))
                          }
                          className="h-10 rounded-md border border-[#b8c2d2] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none transition-colors focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/15"
                        >
                          {PAGE_SIZE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                          }
                          disabled={safeCurrentPage === 1}
                          className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
                        >
                          {t.previousPage}
                        </button>
                        <span className="text-sm font-medium text-[#64748b]">
                          {usersPageCountMessage}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPage((page) =>
                              Math.min(totalPages, page + 1),
                            )
                          }
                          disabled={safeCurrentPage === totalPages}
                          className="inline-flex h-10 items-center justify-center rounded-md border border-[#b8c2d2] bg-white px-3 text-sm font-semibold text-[#172033] shadow-sm transition-colors hover:border-[#8796ac] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#64748b] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#64748b]"
                        >
                          {t.nextPage}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <UsersTable
                users={paginatedUsers}
                currentUserId={trustedUser?.id ?? null}
                emptyMessage={usersEmptyMessage}
                isActionsDisabled={
                  createUserFlow.isSubmitting ||
                  editUserFlow.isSubmitting ||
                  isUserRolesBusy ||
                  isUserStatusUpdating
                }
                sortDirection={sortDirection}
                sortKey={sortKey}
                updatingUserStatusId={userStatusFlow.updatingUserStatusId}
                onEditUser={handleEditUser}
                onSort={handleSort}
                onToggleUserStatus={handleToggleUserStatus}
                onViewRoles={handleViewRoles}
              />
            </>
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
