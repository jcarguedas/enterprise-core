import { apiConfig } from "@/lib/api-config";
import { isInactiveAccountApiResponse } from "@/lib/inactive-account";

export type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  identification_type: string | null;
  identification_number: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
  created_by_user_id: number | null;
  updated_by_user_id: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type CustomersResponse = {
  customers?: Customer[];
  message?: string;
};

type InactiveAccountResult = {
  status: "inactive_account";
};

export type CustomersResult =
  | {
      status: "success";
      customers: Customer[];
    }
  | {
      status: "unauthorized";
    }
  | {
      status: "forbidden";
    }
  | InactiveAccountResult
  | {
      status: "error";
      message: string;
    };

export async function getCustomers(token: string): Promise<CustomersResult> {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/customers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json().catch(() => ({}))) as CustomersResponse;

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

    if (response.status === 403) {
      return {
        status: "forbidden",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ??
          "Unable to load customers. Please try again shortly.",
      };
    }

    if (!Array.isArray(data.customers)) {
      return {
        status: "error",
        message: "The customers response was incomplete. Please try again.",
      };
    }

    return {
      status: "success",
      customers: data.customers,
    };
  } catch {
    return {
      status: "error",
      message:
        "Unable to reach the auth service. Please confirm it is running and try again.",
    };
  }
}
