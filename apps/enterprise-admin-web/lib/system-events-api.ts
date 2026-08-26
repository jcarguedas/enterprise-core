import { apiConfig } from "@/lib/api-config";
import { isInactiveAccountApiResponse } from "@/lib/inactive-account";

export type SystemEvent = {
  id: number;
  event_type: string;
  severity: string;
  message: string | null;
  actor_user_id: number | null;
  actor_email: string | null;
  target_type: string | null;
  target_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata?: unknown;
  created_at: string | null;
};

type SystemEventsResponse = {
  events?: SystemEvent[];
  limit?: number;
  message?: string;
};

type InactiveAccountResult = {
  status: "inactive_account";
};

export type SystemEventsResult =
  | {
      status: "success";
      events: SystemEvent[];
      limit: number;
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

export async function getSystemEvents(
  token: string,
  limit = 50,
): Promise<SystemEventsResult> {
  try {
    const searchParams = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(
      `${apiConfig.baseUrl}/system-events?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json().catch(() => ({}))) as
      SystemEventsResponse;

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
        message: data.message ?? "",
      };
    }

    if (!Array.isArray(data.events)) {
      return {
        status: "error",
        message: "",
      };
    }

    return {
      status: "success",
      events: data.events,
      limit: typeof data.limit === "number" ? data.limit : limit,
    };
  } catch {
    return {
      status: "error",
      message: "",
    };
  }
}
