import type { StoredUser } from "@/lib/auth-storage";

export const MANAGE_USERS_PERMISSION = "manage-users";
export const VIEW_SYSTEM_EVENTS_PERMISSION = "view-system-events";
export const VIEW_CUSTOMERS_PERMISSION = "view-customers";
export const MANAGE_CUSTOMERS_PERMISSION = "manage-customers";

export function hasPermission(
  user: Pick<StoredUser, "permissions"> | null | undefined,
  permissionSlug: string,
) {
  return user?.permissions.includes(permissionSlug) ?? false;
}
