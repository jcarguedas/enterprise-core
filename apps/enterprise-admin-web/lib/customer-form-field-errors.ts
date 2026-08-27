import type { SharedMessages } from "@/lib/i18n/messages";

export type CustomerFormFieldErrors = {
  name?: string;
  email?: string;
  fiscalEmail?: string;
  identificationType?: string;
  identificationNumber?: string;
  economicActivityCode?: string;
  provinceCode?: string;
  cantonCode?: string;
  districtCode?: string;
  neighborhoodCode?: string;
};

const customerFieldByBackendKey: Record<string, keyof CustomerFormFieldErrors> = {
  name: "name",
  email: "email",
  fiscal_email: "fiscalEmail",
  identification_type: "identificationType",
  identification_number: "identificationNumber",
  economic_activity_code: "economicActivityCode",
  province_code: "provinceCode",
  canton_code: "cantonCode",
  district_code: "districtCode",
  neighborhood_code: "neighborhoodCode",
};

export const economicActivityCodePattern = /^\d{4}\.\d$/;

export function sanitizeEconomicActivityCodeInput(value: string) {
  return value
    .replace(/[^\d.]/g, "")
    .replace(/(\..*)\./g, "$1")
    .slice(0, 6);
}

export function getCustomerFieldErrorsFromApiErrors(
  errors: Record<string, string[]>,
  messages: SharedMessages,
) {
  const fieldErrors: CustomerFormFieldErrors = {};

  Object.entries(errors).forEach(([field, fieldMessages]) => {
    const fieldKey = customerFieldByBackendKey[field];

    if (!fieldKey) {
      return;
    }

    fieldErrors[fieldKey] = localizeCustomerApiFieldMessage(
      fieldMessages[0] ?? "",
      messages,
    );
  });

  return fieldErrors;
}

function localizeCustomerApiFieldMessage(
  message: string,
  messages: SharedMessages,
) {
  if (message === "The name field is required.") {
    return messages.apiErrorNameRequired;
  }

  if (message === "The email field must be a valid email address.") {
    return messages.apiErrorEmailInvalid;
  }

  if (message === "The fiscal email field must be a valid email address.") {
    return messages.apiErrorFiscalEmailInvalid;
  }

  if (message === "The selected identification type is invalid.") {
    return messages.apiErrorIdentificationTypeInvalid;
  }

  if (message === "The identification number field is required.") {
    return messages.taxpayerLookupIdentificationRequired;
  }

  if (message === "The identification number field format is invalid.") {
    return messages.taxpayerLookupIdentificationNumeric;
  }

  if (
    message === "The identification number field must be at least 9 characters." ||
    message ===
      "The identification number field must not be greater than 12 characters."
  ) {
    return messages.taxpayerLookupIdentificationLength;
  }

  if (message === "The selected province code is invalid.") {
    return messages.customerProvinceRequired;
  }

  if (message === "The selected canton code is invalid.") {
    return messages.customerCantonRequired;
  }

  if (message === "The selected district code is invalid.") {
    return messages.customerDistrictRequired;
  }

  if (message === "The selected neighborhood code is invalid.") {
    return messages.customerNeighborhoodRequired;
  }

  if (
    message === "The economic activity code field format is invalid." ||
    message ===
      "The economic activity code field must be exactly 6 characters."
  ) {
    return messages.customerEconomicActivityCodeFormat;
  }

  return message;
}
