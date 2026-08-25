import type { StoredUser } from "@/lib/auth-storage";

export const MANAGE_USERS_PERMISSION = "manage-users";

export function hasPermission(
  user: Pick<StoredUser, "permissions"> | null | undefined,
  permissionSlug: string,
) {
  return user?.permissions.includes(permissionSlug) ?? false;
}
