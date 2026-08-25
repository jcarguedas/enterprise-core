export const TOKEN_STORAGE_KEY = "enterprise_core_token";
export const USER_STORAGE_KEY = "enterprise_core_user";
const AUTH_STORAGE_EVENT = "enterprise-core-auth-storage";

export type StoredRole = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
};

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  roles: StoredRole[];
  permissions: string[];
};

export type StoredUserInput = {
  id: number;
  name: string;
  email: string;
  roles?: StoredRole[];
  permissions?: string[];
};

function isBrowser() {
  return typeof window !== "undefined";
}

function emitAuthStorageChange() {
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function subscribeToAuthStorage(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_STORAGE_EVENT, onStoreChange);
  };
}

export function getStoredToken() {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUserJson() {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(USER_STORAGE_KEY);
}

export function parseStoredUser(storedUser: string | null): StoredUser | null {
  if (!storedUser) {
    return null;
  }

  try {
    return normalizeStoredUser(JSON.parse(storedUser) as StoredUserInput);
  } catch {
    return null;
  }
}

export function getStoredUser(): StoredUser | null {
  return parseStoredUser(getStoredUserJson());
}

export function normalizeStoredUser(user: StoredUserInput): StoredUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: Array.isArray(user.roles) ? user.roles : [],
    permissions: Array.isArray(user.permissions)
      ? user.permissions.filter(
          (permission): permission is string => typeof permission === "string",
        )
      : [],
  };
}

export function storeAuth(token: string, user: StoredUserInput) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify(normalizeStoredUser(user)),
  );
  emitAuthStorageChange();
}

export function storeUser(user: StoredUserInput) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify(normalizeStoredUser(user)),
  );
  emitAuthStorageChange();
}

export function clearStoredAuth() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  emitAuthStorageChange();
}
