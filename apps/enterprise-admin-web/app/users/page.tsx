"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AccessDeniedState } from "@/components/admin/AccessDeniedState";
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
import { useI18n } from "@/lib/i18n/use-i18n";
import { INACTIVE_ACCOUNT_LOGIN_PATH } from "@/lib/inactive-account";
import { hasPermission, MANAGE_USERS_PERMISSION } from "@/lib/permissions";
import { useCreateUser } from "@/lib/use-create-user";
import { useEditUser } from "@/lib/use-edit-user";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";
import { useUserRoles } from "@/lib/use-user-roles";
import { useUserStatus } from "@/lib/use-user-status";
import { getUsers } from "@/lib/users-api";
import type { EnterpriseUser } from "@/lib/users-api";

type UsersLoadStatus = "idle" | "loading" | "ready" | "error" | "access_denied";

const PAGE_SIZE_OPTIONS = [5, 10, 25];

function UsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages: t } = useI18n();
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
  const [shouldFocusCreateUserForm, setShouldFocusCreateUserForm] =
    useState(false);
  const createUserFormRef = useRef<HTMLDivElement>(null);
  const hasAppliedCreateUserIntentRef = useRef(false);
  const canManageUsers = hasPermission(trustedUser, MANAGE_USERS_PERMISSION);
  const isAccessDenied =
    (status === "ready" && !canManageUsers) ||
    usersStatus === "access_denied";
  const handleInactiveAccount = useCallback(() => {
    clearStoredAuth();
    router.replace(INACTIVE_ACCOUNT_LOGIN_PATH);
  }, [router]);
  const createUserFlow = useCreateUser({
    onInactiveAccount: handleInactiveAccount,
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
    onInactiveAccount: handleInactiveAccount,
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
    onInactiveAccount: handleInactiveAccount,
    onUnauthorized: () => {
      clearStoredAuth();
      router.replace("/login");
    },
  });
  const userStatusFlow = useUserStatus({
    onInactiveAccount: handleInactiveAccount,
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
  }, [
    normalizedSearchQuery,
    sortDirection,
    sortKey,
    t.active,
    t.inactive,
    users,
  ]);
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
  const usersSummaryCards = [
    {
      title: t.userDirectory,
      getDescription: (users: EnterpriseUser[]) =>
        users.length === 1
          ? t.enterpriseAccountAvailable
          : t.enterpriseAccountsAvailable.replace(
              "{count}",
              users.length.toString(),
            ),
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

  const loadUsers = useCallback(
    async (
      currentToken: string,
      options: {
        isRefresh?: boolean;
        shouldApplyResult?: () => boolean;
      } = {},
    ) => {
      const { isRefresh = false, shouldApplyResult = () => true } = options;

      if (!canManageUsers) {
        return;
      }

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

      if (result.status === "inactive_account") {
        handleInactiveAccount();
        return;
      }

      if (result.status === "forbidden") {
        setUsers([]);
        setUsersStatus("access_denied");
        return;
      }

      setUsers([]);
      setUsersErrorMessage(result.message);
      setUsersStatus("error");
    },
    [canManageUsers, handleInactiveAccount, router],
  );

  const refreshUsers = useCallback(() => {
    if (!canManageUsers) {
      return;
    }

    const token = getStoredToken();

    if (!token) {
      clearStoredAuth();
      router.replace("/login");
      return;
    }

    loadUsers(token, { isRefresh: true });
  }, [canManageUsers, loadUsers, router]);

  const handleShowCreateUserForm = useCallback(() => {
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
  }, [
    createUserFlow,
    editUserFlow,
    isUserStatusUpdating,
    userRolesFlow,
    userStatusFlow,
  ]);

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

    if (!canManageUsers) {
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
  }, [canManageUsers, loadUsers, router, status]);

  useEffect(() => {
    const intent = searchParams.get("intent");

    if (intent !== "create-user") {
      hasAppliedCreateUserIntentRef.current = false;
      return;
    }

    if (
      hasAppliedCreateUserIntentRef.current ||
      status !== "ready" ||
      !canManageUsers
    ) {
      return;
    }

    hasAppliedCreateUserIntentRef.current = true;
    setShouldFocusCreateUserForm(true);
    handleShowCreateUserForm();
  }, [
    canManageUsers,
    createUserFlow.isFormVisible,
    createUserFlow.isSubmitting,
    editUserFlow.isSubmitting,
    handleShowCreateUserForm,
    isUserStatusUpdating,
    searchParams,
    status,
  ]);

  useEffect(() => {
    if (!createUserFlow.isFormVisible || !shouldFocusCreateUserForm) {
      return;
    }

    window.setTimeout(() => {
      createUserFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setShouldFocusCreateUserForm(false);
    }, 0);
  }, [createUserFlow.isFormVisible, shouldFocusCreateUserForm]);

  useEffect(() => {
    const search = searchParams.get("search");

    if (status !== "ready" || !canManageUsers || search === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleSearchQueryChange(search);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canManageUsers, searchParams, status]);

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      trustedUser={trustedUser}
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

        {isAccessDenied ? (
          <AccessDeniedState
            title={t.userManagementAccessDenied}
            description={t.userManagementAccessDeniedDescription}
          />
        ) : null}

        {!isAccessDenied ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {usersSummaryCards.map((card) => (
                <SummaryCard
                  key={card.title}
                  title={card.title}
                  description={card.getDescription(users)}
                />
              ))}
            </div>

            <section className="app-card mt-6 rounded-lg border">
          <div className="app-divider flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="app-text text-base font-semibold">
                {t.userDirectory}
              </h2>
              <p className="app-subtle mt-1 text-sm">
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
                className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
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
                className="app-button-primary inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
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
            <div ref={createUserFormRef}>
              <CreateUserForm
                name={createUserFlow.name}
                email={createUserFlow.email}
                password={createUserFlow.password}
                passwordConfirmation={createUserFlow.passwordConfirmation}
                shouldAutoFocusName={shouldFocusCreateUserForm}
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
            </div>
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
              <div className="app-divider border-b px-5 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="users-search"
                      className="app-muted block text-sm font-medium"
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
                        className="app-input block h-10 min-w-0 flex-1 rounded-md border px-3 text-sm shadow-sm outline-none transition-colors"
                      />
                      {searchQuery ? (
                        <button
                          type="button"
                          onClick={() => handleSearchQueryChange("")}
                          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
                          aria-label={t.clearSearch}
                        >
                          {t.clearSearch}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    <p className="app-subtle text-sm font-medium">
                      {usersCountMessage}
                    </p>
                    {displayedUsers.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="users-page-size"
                          className="app-muted text-sm font-medium"
                        >
                          {t.usersPerPage}
                        </label>
                        <select
                          id="users-page-size"
                          value={pageSize}
                          onChange={(event) =>
                            handlePageSizeChange(Number(event.target.value))
                          }
                          className="app-input h-10 rounded-md border px-3 text-sm shadow-sm outline-none transition-colors"
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
                          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                        >
                          {t.previousPage}
                        </button>
                        <span className="app-subtle text-sm font-medium">
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
                          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
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
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersContent />
    </Suspense>
  );
}
