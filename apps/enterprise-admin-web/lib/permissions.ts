import type { StoredUser } from "@/lib/auth-storage";

export const MANAGE_USERS_PERMISSION = "manage-users";
export const VIEW_SYSTEM_EVENTS_PERMISSION = "view-system-events";

export function hasPermission(
  user: Pick<StoredUser, "permissions"> | null | undefined,
  permissionSlug: string,
) {
  return user?.permissions.includes(permissionSlug) ?? false;
}
