import { apiConfig } from "@/lib/api-config";
import { normalizeStoredUser } from "@/lib/auth-storage";
import type { StoredUser, StoredUserInput } from "@/lib/auth-storage";
import { isInactiveAccountApiResponse } from "@/lib/inactive-account";

type CurrentUserResponse = {
  user?: StoredUserInput;
  id?: number;
  name?: string;
  email?: string;
  roles?: StoredUserInput["roles"];
  permissions?: StoredUserInput["permissions"];
  message?: string;
};

export type CurrentUserResult =
  | {
      status: "authenticated";
      user: StoredUser;
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "inactive_account";
    }
  | {
      status: "error";
      message: string;
    };

export type LogoutResult =
  | {
      status: "success";
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "inactive_account";
    }
  | {
      status: "error";
    };

function getUserFromResponse(data: CurrentUserResponse): StoredUser | null {
  if (data.user) {
    return normalizeStoredUser(data.user);
  }

  if (data.id && data.name && data.email) {
    return normalizeStoredUser({
      id: data.id,
      name: data.name,
      email: data.email,
      roles: data.roles,
      permissions: data.permissions,
    });
  }

  return null;
}

export async function getCurrentUser(token: string): Promise<CurrentUserResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response
      .json()
      .catch(() => ({}))) as CurrentUserResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (isInactiveAccountApiResponse(response, data)) {
      return {
        status: "inactive_account",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ??
          "Unable to validate the current session. Please try again.",
      };
    }

    const user = getUserFromResponse(data);

    if (!user) {
      return {
        status: "error",
        message: "The auth service returned an incomplete user profile.",
      };
    }

    return {
      status: "authenticated",
      user,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}

export async function logoutCurrentUser(token: string): Promise<LogoutResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response
      .json()
      .catch(() => ({}))) as CurrentUserResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (isInactiveAccountApiResponse(response, data)) {
      return {
        status: "inactive_account",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
      };
    }

    return {
      status: "success",
    };
  } catch {
    return {
      status: "error",
    };
  }
}
