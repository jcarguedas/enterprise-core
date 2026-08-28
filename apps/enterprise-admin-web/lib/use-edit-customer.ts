"use client";

import { FormEvent, useState } from "react";

import { useToast } from "@/components/admin/ToastProvider";
import { getStoredToken } from "@/lib/auth-storage";
import {
  type CustomerPayload,
  type Customer,
  updateCustomer,
} from "@/lib/customers-api";
import {
  economicActivityCodePattern,
  getCustomerFieldErrorsFromApiErrors,
  sanitizeEconomicActivityCodeInput,
  type CustomerFormFieldErrors,
} from "@/lib/customer-form-field-errors";
import { useI18n } from "@/lib/i18n/use-i18n";
import {
  localizeApiErrorMessage,
  localizeApiErrorMessages,
} from "@/lib/localized-api-errors";
import {
  lookupTaxpayer as lookupTaxpayerFromApi,
  type TaxpayerLookupSuccessResult,
} from "@/lib/taxpayer-lookup-api";

type UseEditCustomerOptions = {
  onCustomerUpdated: (updatedCustomer: Customer) => void;
  onInactiveAccount: () => void;
  onUnauthorized: () => void;
};

function normalizeOptionalValue(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

export function useEditCustomer({
  onCustomerUpdated,
  onInactiveAccount,
  onUnauthorized,
}: UseEditCustomerOptions) {
  const { addToast } = useToast();
  const { messages: t } = useI18n();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [commercialName, setCommercialName] = useState("");
  const [email, setEmail] = useState("");
  const [fiscalEmail, setFiscalEmail] = useState("");
  const [economicActivityCode, setEconomicActivityCode] = useState("");
  const [economicActivityName, setEconomicActivityName] = useState("");
  const [phone, setPhone] = useState("");
  const [identificationType, setIdentificationType] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [canton, setCanton] = useState("");
  const [cantonCode, setCantonCode] = useState("");
  const [cantonName, setCantonName] = useState("");
  const [district, setDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodCode, setNeighborhoodCode] = useState("");
  const [neighborhoodName, setNeighborhoodName] = useState("");
  const [otherSigns, setOtherSigns] = useState("");
  const [notes, setNotes] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<CustomerFormFieldErrors>({});
  const [isLookingUpTaxpayer, setIsLookingUpTaxpayer] = useState(false);
  const [taxpayerLookupResult, setTaxpayerLookupResult] =
    useState<TaxpayerLookupSuccessResult | null>(null);
  const [taxpayerLookupErrorMessage, setTaxpayerLookupErrorMessage] =
    useState("");
  const [
    selectedTaxpayerEconomicActivityCode,
    setSelectedTaxpayerEconomicActivityCode,
  ] = useState("");

  function clearFieldError(field: keyof CustomerFormFieldErrors) {
    setFieldErrors((currentFieldErrors) => {
      if (!currentFieldErrors[field]) {
        return currentFieldErrors;
      }

      const nextFieldErrors = { ...currentFieldErrors };
      delete nextFieldErrors[field];

      return nextFieldErrors;
    });
  }

  function startEditingCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setName(customer.name);
    setLegalName(customer.legal_name ?? "");
    setCommercialName(customer.commercial_name ?? "");
    setEmail(customer.email ?? "");
    setFiscalEmail(customer.fiscal_email ?? "");
    setEconomicActivityCode(customer.economic_activity_code ?? "");
    setEconomicActivityName(customer.economic_activity_name ?? "");
    setPhone(customer.phone ?? "");
    setIdentificationType(customer.identification_type ?? "");
    setIdentificationNumber(customer.identification_number ?? "");
    setAddress(customer.address ?? "");
    setProvince(customer.province ?? "");
    setProvinceCode(customer.province_code ?? "");
    setProvinceName(customer.province_name ?? "");
    setCanton(customer.canton ?? "");
    setCantonCode(customer.canton_code ?? "");
    setCantonName(customer.canton_name ?? "");
    setDistrict(customer.district ?? "");
    setDistrictCode(customer.district_code ?? "");
    setDistrictName(customer.district_name ?? "");
    setNeighborhood(customer.neighborhood ?? "");
    setNeighborhoodCode(customer.neighborhood_code ?? "");
    setNeighborhoodName(customer.neighborhood_name ?? "");
    setOtherSigns(customer.other_signs ?? "");
    setNotes(customer.notes ?? "");
    setFiscalNotes(customer.fiscal_notes ?? "");
    setIsActive(customer.is_active);
    setErrorMessages([]);
    setFieldErrors({});
    clearTaxpayerLookupResult();
    setIsFormVisible(true);
  }

  function cancelEditing() {
    setSelectedCustomer(null);
    setName("");
    setLegalName("");
    setCommercialName("");
    setEmail("");
    setFiscalEmail("");
    setEconomicActivityCode("");
    setEconomicActivityName("");
    setPhone("");
    setIdentificationType("");
    setIdentificationNumber("");
    setAddress("");
    setProvince("");
    setProvinceCode("");
    setProvinceName("");
    setCanton("");
    setCantonCode("");
    setCantonName("");
    setDistrict("");
    setDistrictCode("");
    setDistrictName("");
    setNeighborhood("");
    setNeighborhoodCode("");
    setNeighborhoodName("");
    setOtherSigns("");
    setNotes("");
    setFiscalNotes("");
    setIsActive(true);
    setErrorMessages([]);
    setFieldErrors({});
    clearTaxpayerLookupResult();
    setIsFormVisible(false);
  }

  function clearErrorMessages() {
    setErrorMessages([]);
  }

  function handleNameChange(value: string) {
    clearFieldError("name");
    setName(value);
  }

  function handleEmailChange(value: string) {
    clearFieldError("email");
    setEmail(value);
  }

  function handleFiscalEmailChange(value: string) {
    clearFieldError("fiscalEmail");
    setFiscalEmail(value);
  }

  function handleIdentificationTypeChange(value: string) {
    clearFieldError("identificationType");
    setIdentificationType(value);
  }

  function handleIdentificationNumberChange(value: string) {
    clearFieldError("identificationNumber");
    setIdentificationNumber(value);
    clearTaxpayerLookupResult();
  }

  function handleEconomicActivityCodeChange(value: string) {
    clearFieldError("economicActivityCode");
    setEconomicActivityCode(sanitizeEconomicActivityCodeInput(value));
  }

  function handleProvinceCodeChange(value: string) {
    clearFieldError("provinceCode");
    setProvinceCode(value);
  }

  function handleCantonCodeChange(value: string) {
    clearFieldError("cantonCode");
    setCantonCode(value);
  }

  function handleDistrictCodeChange(value: string) {
    clearFieldError("districtCode");
    setDistrictCode(value);
  }

  function handleNeighborhoodCodeChange(value: string) {
    clearFieldError("neighborhoodCode");
    setNeighborhoodCode(value);
  }

  function clearTaxpayerLookupResult() {
    setTaxpayerLookupResult(null);
    setTaxpayerLookupErrorMessage("");
    setSelectedTaxpayerEconomicActivityCode("");
  }

  function getTaxpayerLookupIdentificationError() {
    const normalizedIdentificationNumber = identificationNumber.trim();

    if (!normalizedIdentificationNumber) {
      return t.taxpayerLookupIdentificationRequired;
    }

    if (!/^\d+$/.test(normalizedIdentificationNumber)) {
      return t.taxpayerLookupIdentificationNumeric;
    }

    if (
      normalizedIdentificationNumber.length < 9 ||
      normalizedIdentificationNumber.length > 12
    ) {
      return t.taxpayerLookupIdentificationLength;
    }

    return "";
  }

  async function lookupTaxpayer() {
    const identificationError = getTaxpayerLookupIdentificationError();

    clearTaxpayerLookupResult();

    if (identificationError) {
      setFieldErrors((currentFieldErrors) => ({
        ...currentFieldErrors,
        identificationNumber: identificationError,
      }));
      setTaxpayerLookupErrorMessage(identificationError);
      return;
    }

    const token = getStoredToken();

    if (!token) {
      onUnauthorized();
      return;
    }

    setIsLookingUpTaxpayer(true);

    const result = await lookupTaxpayerFromApi(
      token,
      identificationNumber.trim(),
    );

    setIsLookingUpTaxpayer(false);

    if (result.status === "success") {
      setTaxpayerLookupResult(result);
      setSelectedTaxpayerEconomicActivityCode(
        result.taxpayer.economic_activities[0]?.code ?? "",
      );
      return;
    }

    if (result.status === "unauthorized") {
      onUnauthorized();
      return;
    }

    if (result.status === "inactive_account") {
      onInactiveAccount();
      return;
    }

    if (result.status === "forbidden") {
      setTaxpayerLookupErrorMessage(t.customersManageAccessDeniedDescription);
      return;
    }

    if (result.status === "validation_error") {
      setFieldErrors(getCustomerFieldErrorsFromApiErrors(result.errors, t));
      setTaxpayerLookupErrorMessage(
        localizeApiErrorMessages(result.messages, t).join(" "),
      );
      return;
    }

    if (result.status === "not_found") {
      setTaxpayerLookupErrorMessage(t.taxpayerDataNotFound);
      return;
    }

    if (result.status === "rate_limited") {
      setTaxpayerLookupErrorMessage(t.taxpayerLookupRateLimited);
      return;
    }

    if (result.status === "unavailable") {
      setTaxpayerLookupErrorMessage(t.taxpayerLookupUnavailable);
      return;
    }

    setTaxpayerLookupErrorMessage(t.taxpayerLookupFailed);
  }

  function applyTaxpayerData() {
    if (!taxpayerLookupResult) {
      return;
    }

    const { taxpayer } = taxpayerLookupResult;

    if (taxpayer.name) {
      handleNameChange(taxpayer.name);
      setLegalName(taxpayer.name);
    }

    if (
      ["01", "02", "03", "04", "05"].includes(
        taxpayer.identification_type ?? "",
      )
    ) {
      handleIdentificationTypeChange(taxpayer.identification_type ?? "");
    }

    handleIdentificationNumberChange(taxpayer.identification_number);

    const selectedEconomicActivity =
      taxpayer.economic_activities.length === 1
        ? taxpayer.economic_activities[0]
        : taxpayer.economic_activities.find(
            (activity) =>
              activity.code === selectedTaxpayerEconomicActivityCode,
          );

    if (selectedEconomicActivity?.code) {
      handleEconomicActivityCodeChange(selectedEconomicActivity.code);
    }

    if (selectedEconomicActivity?.name) {
      setEconomicActivityName(selectedEconomicActivity.name);
    }

    addToast({
      message: t.taxpayerDataApplied,
      variant: "success",
    });
  }

  function getPayload(): CustomerPayload {
    return {
      name: name.trim(),
      legal_name: normalizeOptionalValue(legalName),
      commercial_name: normalizeOptionalValue(commercialName),
      email: normalizeOptionalValue(email),
      fiscal_email: normalizeOptionalValue(fiscalEmail),
      economic_activity_code: normalizeOptionalValue(economicActivityCode),
      economic_activity_name: normalizeOptionalValue(economicActivityName),
      phone: normalizeOptionalValue(phone),
      identification_type: normalizeOptionalValue(identificationType),
      identification_number: normalizeOptionalValue(identificationNumber),
      address: normalizeOptionalValue(address),
      province: normalizeOptionalValue(province),
      province_code: normalizeOptionalValue(provinceCode),
      province_name: normalizeOptionalValue(provinceName),
      canton: normalizeOptionalValue(canton),
      canton_code: normalizeOptionalValue(cantonCode),
      canton_name: normalizeOptionalValue(cantonName),
      district: normalizeOptionalValue(district),
      district_code: normalizeOptionalValue(districtCode),
      district_name: normalizeOptionalValue(districtName),
      neighborhood: normalizeOptionalValue(neighborhood),
      neighborhood_code: normalizeOptionalValue(neighborhoodCode),
      neighborhood_name: normalizeOptionalValue(neighborhoodName),
      other_signs: normalizeOptionalValue(otherSigns),
      notes: normalizeOptionalValue(notes),
      fiscal_notes: normalizeOptionalValue(fiscalNotes),
      is_active: isActive,
    };
  }

  function validateForm() {
    const messages: string[] = [];

    if (!provinceCode.trim()) {
      messages.push(t.customerProvinceRequired);
    }

    if (!cantonCode.trim()) {
      messages.push(t.customerCantonRequired);
    }

    if (!districtCode.trim()) {
      messages.push(t.customerDistrictRequired);
    }

    if (!neighborhoodCode.trim()) {
      messages.push(t.customerNeighborhoodRequired);
    }

    if (
      economicActivityCode.trim() &&
      !economicActivityCodePattern.test(economicActivityCode.trim())
    ) {
      messages.push(t.customerEconomicActivityCodeFormat);
    }

    return messages;
  }

  function getFrontendFieldErrors() {
    const nextFieldErrors: CustomerFormFieldErrors = {};

    if (!provinceCode.trim()) {
      nextFieldErrors.provinceCode = t.customerProvinceRequired;
    }

    if (!cantonCode.trim()) {
      nextFieldErrors.cantonCode = t.customerCantonRequired;
    }

    if (!districtCode.trim()) {
      nextFieldErrors.districtCode = t.customerDistrictRequired;
    }

    if (!neighborhoodCode.trim()) {
      nextFieldErrors.neighborhoodCode = t.customerNeighborhoodRequired;
    }

    if (
      economicActivityCode.trim() &&
      !economicActivityCodePattern.test(economicActivityCode.trim())
    ) {
      nextFieldErrors.economicActivityCode =
        t.customerEconomicActivityCodeFormat;
    }

    return nextFieldErrors;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessages([]);

    if (!selectedCustomer) {
      return;
    }

    const validationMessages = validateForm();

    if (validationMessages.length > 0) {
      setFieldErrors(getFrontendFieldErrors());
      setErrorMessages(validationMessages);
      return;
    }

    setIsSubmitting(true);

    const token = getStoredToken();

    if (!token) {
      setIsSubmitting(false);
      onUnauthorized();
      return;
    }

    const result = await updateCustomer(
      token,
      selectedCustomer.id,
      getPayload(),
    );

    setIsSubmitting(false);

    if (result.status === "success") {
      onCustomerUpdated(result.customer);
      cancelEditing();
      addToast({
        message: t.customerUpdatedSuccessfully,
        variant: "success",
      });
      return;
    }

    if (result.status === "unauthorized") {
      onUnauthorized();
      return;
    }

    if (result.status === "inactive_account") {
      onInactiveAccount();
      return;
    }

    if (result.status === "forbidden") {
      setErrorMessages([t.customersManageAccessDeniedDescription]);
      return;
    }

    if (result.status === "validation_error") {
      setFieldErrors(getCustomerFieldErrorsFromApiErrors(result.errors, t));
      setErrorMessages(localizeApiErrorMessages(result.messages, t));
      return;
    }

    setErrorMessages([localizeApiErrorMessage(result.message, t)]);
  }

  return {
    address,
    canton,
    cantonCode,
    cantonName,
    commercialName,
    district,
    districtCode,
    districtName,
    email,
    economicActivityCode,
    economicActivityName,
    errorMessages,
    fieldErrors,
    fiscalEmail,
    fiscalNotes,
    identificationNumber,
    identificationType,
    isActive,
    isFormVisible,
    isSubmitting,
    legalName,
    name,
    neighborhood,
    neighborhoodCode,
    neighborhoodName,
    notes,
    otherSigns,
    phone,
    province,
    provinceCode,
    provinceName,
    selectedCustomer,
    cancelEditing,
    clearErrorMessages,
    setAddress,
    setCanton,
    setCantonCode: handleCantonCodeChange,
    setCantonName,
    setCommercialName,
    setDistrict,
    setDistrictCode: handleDistrictCodeChange,
    setDistrictName,
    setEmail: handleEmailChange,
    setEconomicActivityCode: handleEconomicActivityCodeChange,
    setEconomicActivityName,
    setFiscalEmail: handleFiscalEmailChange,
    setFiscalNotes,
    setIdentificationNumber: handleIdentificationNumberChange,
    setIdentificationType: handleIdentificationTypeChange,
    setIsActive,
    setLegalName,
    setName: handleNameChange,
    setNeighborhood,
    setNeighborhoodCode: handleNeighborhoodCodeChange,
    setNeighborhoodName,
    setNotes,
    setOtherSigns,
    setPhone,
    setProvince,
    setProvinceCode: handleProvinceCodeChange,
    setProvinceName,
    startEditingCustomer,
    applyTaxpayerData,
    clearTaxpayerLookupResult,
    isLookingUpTaxpayer,
    lookupTaxpayer,
    selectedTaxpayerEconomicActivityCode,
    setSelectedTaxpayerEconomicActivityCode,
    submit,
    taxpayerLookupErrorMessage,
    taxpayerLookupResult,
  };
}
