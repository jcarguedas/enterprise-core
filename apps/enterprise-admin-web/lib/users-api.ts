import { apiConfig } from "@/lib/api-config";

export type EnterpriseUser = {
  id: number;
  name: string;
  email: string;
};

type UsersResponse = {
  users?: EnterpriseUser[];
  message?: string;
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
