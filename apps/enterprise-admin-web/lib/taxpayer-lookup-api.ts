import { apiConfig } from "@/lib/api-config";
import { isInactiveAccountApiResponse } from "@/lib/inactive-account";

export type TaxpayerEconomicActivity = {
  code: string | null;
  name: string | null;
  status: string | null;
};

export type TaxpayerLookupData = {
  identification_number: string;
  name: string | null;
  identification_type: string | null;
  tax_regime: string | null;
  tax_status: string | null;
  economic_activities: TaxpayerEconomicActivity[];
};

type TaxpayerLookupResponse = {
  taxpayer?: TaxpayerLookupData;
  source?: "cache" | "live";
  fetched_at?: string | null;
  message?: string;
  errors?: Record<string, string[] | string>;
};

type ValidationErrorResult = {
  status: "validation_error";
  messages: string[];
  errors: Record<string, string[]>;
};

type InactiveAccountResult = {
  status: "inactive_account";
};

export type TaxpayerLookupSuccessResult = {
  status: "success";
  taxpayer: TaxpayerLookupData;
  source: "cache" | "live";
  fetched_at: string | null;
};

export type TaxpayerLookupResult =
  | TaxpayerLookupSuccessResult
  | {
      status: "unauthorized";
    }
  | {
      status: "forbidden";
    }
  | InactiveAccountResult
  | ValidationErrorResult
  | {
      status: "not_found";
      message: string;
    }
  | {
      status: "rate_limited";
      message: string;
    }
  | {
      status: "unavailable";
      message: string;
    }
  | {
      status: "error";
      message: string;
    };

function getValidationMessages(response: TaxpayerLookupResponse) {
  if (!response.errors) {
    return response.message ? [response.message] : [];
  }

  return Object.values(response.errors).flatMap((value) =>
    Array.isArray(value) ? value : [value],
  );
}

function getValidationErrors(response: TaxpayerLookupResponse) {
  if (!response.errors) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(response.errors).map(([field, value]) => [
      field,
      Array.isArray(value) ? value : [value],
    ]),
  );
}

export async function lookupTaxpayer(
  token: string,
  identificationNumber: string,
): Promise<TaxpayerLookupResult> {
  const searchParams = new URLSearchParams({
    identification_number: identificationNumber,
  });

  try {
    const response = await fetch(
      `${apiConfig.baseUrl}/taxpayer-lookup?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response
      .json()
      .catch(() => ({}))) as TaxpayerLookupResponse;

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

    if (response.status === 422) {
      const messages = getValidationMessages(data);
      const errors = getValidationErrors(data);

      return {
        status: "validation_error",
        messages:
          messages.length > 0
            ? messages
            : ["Please correct the highlighted fields and try again."],
        errors,
      };
    }

    if (response.status === 404) {
      return {
        status: "not_found",
        message:
          data.message ??
          "No Hacienda taxpayer data was found for this identification.",
      };
    }

    if (response.status === 429) {
      return {
        status: "rate_limited",
        message:
          data.message ??
          "Hacienda temporarily rate limited the lookup. Try again later.",
      };
    }

    if (response.status === 503) {
      return {
        status: "unavailable",
        message:
          data.message ??
          "Hacienda lookup is unavailable right now. You can continue entering the data manually.",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message: data.message ?? "Taxpayer lookup failed.",
      };
    }

    if (!data.taxpayer || !data.source) {
      return {
        status: "error",
        message: "The taxpayer lookup response was incomplete.",
      };
    }

    return {
      status: "success",
      taxpayer: data.taxpayer,
      source: data.source,
      fetched_at: data.fetched_at ?? null,
    };
  } catch {
    return {
      status: "unavailable",
      message:
        "Hacienda lookup is unavailable right now. You can continue entering the data manually.",
    };
  }
}
