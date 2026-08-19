import { apiConfig } from "@/lib/api-config";

export type EnterpriseUser = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
};

export type EnterpriseRole = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
};

type UsersResponse = {
  users?: EnterpriseUser[];
  message?: string;
};

type UserRolesResponse = {
  roles?: EnterpriseRole[];
  message?: string;
};

type ValidationResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type UserResponse = ValidationResponse & {
  user?: EnterpriseUser;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  is_active?: boolean;
};

export type UsersResult =
  | {
      status: "success";
      users: EnterpriseUser[];
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "error";
      message: string;
    };

export type UserRolesResult =
  | {
      status: "success";
      roles: EnterpriseRole[];
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "error";
      message: string;
    };

export type AssignUserRoleResult =
  | {
      status: "success";
      roles: EnterpriseRole[];
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "validation_error";
      messages: string[];
    }
  | {
      status: "error";
      message: string;
    };

export type RemoveUserRoleResult =
  | {
      status: "success";
      roles: EnterpriseRole[];
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "error";
      message: string;
    };

export type CreateUserResult =
  | {
      status: "success";
      user: EnterpriseUser;
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "validation_error";
      messages: string[];
    }
  | {
      status: "error";
      message: string;
    };

export type UpdateUserResult =
  | {
      status: "success";
      user: EnterpriseUser;
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "validation_error";
      messages: string[];
    }
  | {
      status: "error";
      message: string;
    };

function getValidationMessages(response: ValidationResponse) {
  if (!response.errors) {
    return response.message ? [response.message] : [];
  }

  return Object.values(response.errors).flatMap((value) =>
    Array.isArray(value) ? value : [value],
  );
}

export async function getUsers(token: string): Promise<UsersResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json().catch(() => ({}))) as UsersResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ?? "Unable to load users. Please try again shortly.",
      };
    }

    if (!Array.isArray(data.users)) {
      return {
        status: "error",
        message: "The users response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      users: data.users,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}

export async function getUserRoles(
  token: string,
  userId: number,
): Promise<UserRolesResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/users/${userId}/roles`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json().catch(() => ({}))) as UserRolesResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ??
          "Unable to load roles for this user. Please try again shortly.",
      };
    }

    if (!Array.isArray(data.roles)) {
      return {
        status: "error",
        message: "The user roles response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      roles: data.roles,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}

export async function getRoles(token: string): Promise<UserRolesResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/roles`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json().catch(() => ({}))) as UserRolesResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ?? "Unable to load roles. Please try again shortly.",
      };
    }

    if (!Array.isArray(data.roles)) {
      return {
        status: "error",
        message: "The roles response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      roles: data.roles,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}

export async function assignUserRole(
  token: string,
  userId: number,
  roleId: number,
): Promise<AssignUserRoleResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/users/${userId}/roles`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role_id: roleId,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as UserRolesResponse &
      ValidationResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (response.status === 422) {
      const messages = getValidationMessages(data);

      return {
        status: "validation_error",
        messages:
          messages.length > 0
            ? messages
            : ["Please select a valid role and try again."],
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ??
          "Unable to assign the role. Please try again shortly.",
      };
    }

    if (!Array.isArray(data.roles)) {
      return {
        status: "error",
        message: "The assign role response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      roles: data.roles,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}

export async function removeUserRole(
  token: string,
  userId: number,
  roleId: number,
): Promise<RemoveUserRoleResult> {
  try {
    const response = await fetch(
      `${apiConfig.baseUrl}/users/${userId}/roles/${roleId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json().catch(() => ({}))) as UserRolesResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ??
          "Unable to remove the role. Please try again shortly.",
      };
    }

    if (!Array.isArray(data.roles)) {
      return {
        status: "error",
        message: "The remove role response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      roles: data.roles,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}

export async function createUser(
  token: string,
  payload: CreateUserPayload,
): Promise<CreateUserResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as UserResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (response.status === 422) {
      const messages = getValidationMessages(data);

      return {
        status: "validation_error",
        messages:
          messages.length > 0
            ? messages
            : ["Please correct the highlighted fields and try again."],
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ?? "Unable to create the user. Please try again shortly.",
      };
    }

    if (!data.user) {
      return {
        status: "error",
        message: "The create user response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      user: data.user,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}

export async function updateUser(
  token: string,
  userId: number,
  payload: UpdateUserPayload,
): Promise<UpdateUserResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as UserResponse;

    if (response.status === 401) {
      return {
        status: "unauthorized",
      };
    }

    if (response.status === 422) {
      const messages = getValidationMessages(data);

      return {
        status: "validation_error",
        messages:
          messages.length > 0
            ? messages
            : ["Please correct the highlighted fields and try again."],
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ?? "Unable to update the user. Please try again shortly.",
      };
    }

    if (!data.user) {
      return {
        status: "error",
        message: "The update user response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      user: data.user,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}
