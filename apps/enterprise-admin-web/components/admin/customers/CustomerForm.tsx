"use client";

import type { FormEventHandler, ReactNode } from "react";

import { StatusMessage } from "@/components/admin/StatusMessage";
import {
  sanitizeEconomicActivityCodeInput,
  type CustomerFormFieldErrors,
} from "@/lib/customer-form-field-errors";
import { customerLocationCatalog } from "@/lib/customer-location-catalog";
import { useI18n } from "@/lib/i18n/use-i18n";

type CustomerFormMode = "create" | "edit";

type CustomerFormProps = {
  mode: CustomerFormMode;
  name: string;
  legalName: string;
  commercialName: string;
  email: string;
  fiscalEmail: string;
  economicActivityCode: string;
  economicActivityName: string;
  phone: string;
  identificationType: string;
  identificationNumber: string;
  address: string;
  province: string;
  provinceCode: string;
  provinceName: string;
  canton: string;
  cantonCode: string;
  cantonName: string;
  district: string;
  districtCode: string;
  districtName: string;
  neighborhood: string;
  neighborhoodCode: string;
  neighborhoodName: string;
  otherSigns: string;
  notes: string;
  fiscalNotes: string;
  isActive: boolean;
  shouldAutoFocusName?: boolean;
  isSubmitting: boolean;
  errorMessages: string[];
  fieldErrors: CustomerFormFieldErrors;
  onNameChange: (value: string) => void;
  onLegalNameChange: (value: string) => void;
  onCommercialNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onFiscalEmailChange: (value: string) => void;
  onEconomicActivityCodeChange: (value: string) => void;
  onEconomicActivityNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onIdentificationTypeChange: (value: string) => void;
  onIdentificationNumberChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onProvinceCodeChange: (value: string) => void;
  onProvinceNameChange: (value: string) => void;
  onCantonChange: (value: string) => void;
  onCantonCodeChange: (value: string) => void;
  onCantonNameChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onDistrictCodeChange: (value: string) => void;
  onDistrictNameChange: (value: string) => void;
  onNeighborhoodChange: (value: string) => void;
  onNeighborhoodCodeChange: (value: string) => void;
  onNeighborhoodNameChange: (value: string) => void;
  onOtherSignsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onFiscalNotesChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onClearErrorMessages: () => void;
};

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

type TextFieldProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: "email" | "tel" | "text";
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: "decimal" | "numeric";
  maxLength?: number;
  pattern?: string;
  required?: boolean;
  errorMessage?: string;
};

type TextAreaFieldProps = TextFieldProps & {
  rows?: number;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = Omit<TextFieldProps, "type" | "autoComplete"> & {
  options: SelectOption[];
};

const inputClassName =
  "app-input mt-2 block h-11 w-full rounded-md border px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed";
const textAreaClassName =
  "app-input mt-2 block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed";
const fieldErrorClassName =
  "border-[var(--app-error-border)] focus:border-[var(--app-error-border)] focus:ring-[var(--app-error-text)]";

function getFieldClassName(className: string, errorMessage?: string) {
  return errorMessage ? `${className} ${fieldErrorClassName}` : className;
}

function FieldErrorMessage({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-1 text-xs text-[var(--app-error-text)]">
      {message}
    </p>
  );
}

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset>
      <legend className="app-text text-sm font-semibold">{title}</legend>
      {description ? (
        <p className="app-subtle mt-1 text-sm">{description}</p>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function TextField({
  id,
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
  autoComplete,
  autoFocus = false,
  inputMode,
  maxLength,
  pattern,
  required = false,
  errorMessage,
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="app-muted block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        required={required}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={getFieldClassName(inputClassName, errorMessage)}
      />
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  name,
  value,
  onChange,
  disabled,
  rows = 3,
  errorMessage,
}: TextAreaFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="app-muted block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        className={getFieldClassName(textAreaClassName, errorMessage)}
      />
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </div>
  );
}

function SelectField({
  id,
  label,
  name,
  value,
  onChange,
  disabled,
  options,
  errorMessage,
}: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="app-muted block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        className={getFieldClassName(inputClassName, errorMessage)}
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldErrorMessage id={errorId} message={errorMessage} />
    </div>
  );
}

export function CustomerForm({
  mode,
  name,
  legalName,
  commercialName,
  email,
  fiscalEmail,
  economicActivityCode,
  economicActivityName,
  phone,
  identificationType,
  identificationNumber,
  address,
  provinceCode,
  cantonCode,
  districtCode,
  neighborhoodCode,
  otherSigns,
  notes,
  fiscalNotes,
  isActive,
  shouldAutoFocusName = false,
  isSubmitting,
  errorMessages,
  fieldErrors,
  onNameChange,
  onLegalNameChange,
  onCommercialNameChange,
  onEmailChange,
  onFiscalEmailChange,
  onEconomicActivityCodeChange,
  onEconomicActivityNameChange,
  onPhoneChange,
  onIdentificationTypeChange,
  onIdentificationNumberChange,
  onAddressChange,
  onProvinceChange,
  onProvinceCodeChange,
  onProvinceNameChange,
  onCantonChange,
  onCantonCodeChange,
  onCantonNameChange,
  onDistrictChange,
  onDistrictCodeChange,
  onDistrictNameChange,
  onNeighborhoodChange,
  onNeighborhoodCodeChange,
  onNeighborhoodNameChange,
  onOtherSignsChange,
  onNotesChange,
  onFiscalNotesChange,
  onIsActiveChange,
  onSubmit,
  onCancel,
  onClearErrorMessages,
}: CustomerFormProps) {
  const { messages: t } = useI18n();
  const title = mode === "create" ? t.createCustomer : t.editCustomer;
  const submitLabel = mode === "create" ? t.saveCustomer : t.updateCustomer;
  const submittingLabel =
    mode === "create" ? t.creatingCustomer : t.updatingCustomer;
  const selectedProvince = customerLocationCatalog.find(
    (provinceOption) => provinceOption.code === provinceCode,
  );
  const availableCantons = selectedProvince?.cantons ?? [];
  const selectedCanton = availableCantons.find(
    (cantonOption) => cantonOption.code === cantonCode,
  );
  const availableDistricts = selectedCanton?.districts ?? [];
  const selectedDistrict = availableDistricts.find(
    (districtOption) => districtOption.code === districtCode,
  );
  const availableNeighborhoods = selectedDistrict?.neighborhoods ?? [];
  const identificationTypeOptions = [
    {
      label: t.selectIdentificationType,
      value: "",
    },
    {
      label: t.identificationTypePhysicalId,
      value: "01",
    },
    {
      label: t.identificationTypeLegalEntityId,
      value: "02",
    },
    {
      label: t.identificationTypeDimex,
      value: "03",
    },
    {
      label: t.identificationTypeNite,
      value: "04",
    },
    {
      label: t.identificationTypeNonDomiciledForeigner,
      value: "05",
    },
  ];
  const provinceOptions = [
    {
      label: t.selectProvince,
      value: "",
    },
    ...customerLocationCatalog.map((provinceOption) => ({
      label: provinceOption.name,
      value: provinceOption.code,
    })),
  ];
  const cantonOptions = [
    {
      label:
        provinceCode && availableCantons.length === 0
          ? t.noCantonsAvailable
          : t.selectCanton,
      value: "",
    },
    ...availableCantons.map((cantonOption) => ({
      label: cantonOption.name,
      value: cantonOption.code,
    })),
  ];
  const districtOptions = [
    {
      label:
        cantonCode && availableDistricts.length === 0
          ? t.noDistrictsAvailable
          : t.selectDistrict,
      value: "",
    },
    ...availableDistricts.map((districtOption) => ({
      label: districtOption.name,
      value: districtOption.code,
    })),
  ];
  const neighborhoodOptions = [
    {
      label:
        districtCode && availableNeighborhoods.length === 0
          ? t.noNeighborhoodsAvailable
          : t.selectNeighborhood,
      value: "",
    },
    ...availableNeighborhoods.map((neighborhoodOption) => ({
      label: neighborhoodOption.name,
      value: neighborhoodOption.code,
    })),
  ];

  function clearNeighborhood() {
    onNeighborhoodCodeChange("");
    onNeighborhoodNameChange("");
    onNeighborhoodChange("");
  }

  function clearDistrict() {
    onDistrictCodeChange("");
    onDistrictNameChange("");
    onDistrictChange("");
    clearNeighborhood();
  }

  function clearCanton() {
    onCantonCodeChange("");
    onCantonNameChange("");
    onCantonChange("");
    clearDistrict();
  }

  function handleProvinceChange(nextProvinceCode: string) {
    const nextProvince = customerLocationCatalog.find(
      (provinceOption) => provinceOption.code === nextProvinceCode,
    );
    const nextProvinceName = nextProvince?.name ?? "";

    onProvinceCodeChange(nextProvinceCode);
    onProvinceNameChange(nextProvinceName);
    onProvinceChange(nextProvinceName);
    clearCanton();
  }

  function handleCantonChange(nextCantonCode: string) {
    const nextCanton = availableCantons.find(
      (cantonOption) => cantonOption.code === nextCantonCode,
    );
    const nextCantonName = nextCanton?.name ?? "";

    onCantonCodeChange(nextCantonCode);
    onCantonNameChange(nextCantonName);
    onCantonChange(nextCantonName);
    clearDistrict();
  }

  function handleDistrictChange(nextDistrictCode: string) {
    const nextDistrict = availableDistricts.find(
      (districtOption) => districtOption.code === nextDistrictCode,
    );
    const nextDistrictName = nextDistrict?.name ?? "";

    onDistrictCodeChange(nextDistrictCode);
    onDistrictNameChange(nextDistrictName);
    onDistrictChange(nextDistrictName);
    clearNeighborhood();
  }

  function handleNeighborhoodChange(nextNeighborhoodCode: string) {
    const nextNeighborhood = availableNeighborhoods.find(
      (neighborhoodOption) => neighborhoodOption.code === nextNeighborhoodCode,
    );
    const nextNeighborhoodName = nextNeighborhood?.name ?? "";

    onNeighborhoodCodeChange(nextNeighborhoodCode);
    onNeighborhoodNameChange(nextNeighborhoodName);
    onNeighborhoodChange(nextNeighborhoodName);
  }

  return (
    <form
      className="app-form-panel border-b px-5 py-5"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="mb-5">
        <h3 className="app-text text-sm font-semibold">{title}</h3>
        <p className="app-subtle mt-1 text-sm">{t.customerDetails}</p>
      </div>

      {errorMessages.length > 0 ? (
        <StatusMessage
          variant="error"
          className="mb-5"
          dismissible
          onDismiss={onClearErrorMessages}
        >
          <span className="font-semibold">{t.validationError}: </span>
          {errorMessages.join(" ")}
        </StatusMessage>
      ) : null}

      <div className="space-y-6">
        <FormSection title={t.basicCustomerDetails}>
          <TextField
            id={`${mode}-customer-name`}
            name="name"
            label={t.name}
            value={name}
            onChange={onNameChange}
            disabled={isSubmitting}
            autoComplete="organization"
            autoFocus={shouldAutoFocusName}
            required
            errorMessage={fieldErrors.name}
          />
          <TextField
            id={`${mode}-customer-email`}
            name="email"
            label={t.email}
            value={email}
            onChange={onEmailChange}
            disabled={isSubmitting}
            type="email"
            autoComplete="email"
            errorMessage={fieldErrors.email}
          />
          <TextField
            id={`${mode}-customer-phone`}
            name="phone"
            label={t.phone}
            value={phone}
            onChange={onPhoneChange}
            disabled={isSubmitting}
            type="tel"
            autoComplete="tel"
          />
          <SelectField
            id={`${mode}-customer-identification-type`}
            name="identification_type"
            label={t.identificationType}
            value={identificationType}
            onChange={onIdentificationTypeChange}
            disabled={isSubmitting}
            options={identificationTypeOptions}
            errorMessage={fieldErrors.identificationType}
          />
          <TextField
            id={`${mode}-customer-identification-number`}
            name="identification_number"
            label={t.identificationNumber}
            value={identificationNumber}
            onChange={onIdentificationNumberChange}
            disabled={isSubmitting}
          />
          <div className="flex items-end">
            <label className="app-muted inline-flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => onIsActiveChange(event.target.checked)}
                disabled={isSubmitting}
                className="size-4 rounded border-[var(--app-border)]"
              />
              <span>{t.active}</span>
            </label>
          </div>
        </FormSection>

        <FormSection
          title={t.fiscalProfile}
          description={t.fiscalProfileHelperText}
        >
          <TextField
            id={`${mode}-customer-legal-name`}
            name="legal_name"
            label={t.legalName}
            value={legalName}
            onChange={onLegalNameChange}
            disabled={isSubmitting}
            autoComplete="organization"
          />
          <TextField
            id={`${mode}-customer-commercial-name`}
            name="commercial_name"
            label={t.commercialName}
            value={commercialName}
            onChange={onCommercialNameChange}
            disabled={isSubmitting}
            autoComplete="organization"
          />
          <TextField
            id={`${mode}-customer-fiscal-email`}
            name="fiscal_email"
            label={t.fiscalEmail}
            value={fiscalEmail}
            onChange={onFiscalEmailChange}
            disabled={isSubmitting}
            type="email"
            autoComplete="email"
            errorMessage={fieldErrors.fiscalEmail}
          />
          <TextField
            id={`${mode}-customer-economic-activity-code`}
            name="economic_activity_code"
            label={t.economicActivityCode}
            value={economicActivityCode}
            onChange={(value) =>
              onEconomicActivityCodeChange(
                sanitizeEconomicActivityCodeInput(value),
              )
            }
            disabled={isSubmitting}
            inputMode="decimal"
            maxLength={6}
            pattern="[0-9]{4}\.[0-9]"
            errorMessage={fieldErrors.economicActivityCode}
          />
          <TextField
            id={`${mode}-customer-economic-activity-name`}
            name="economic_activity_name"
            label={t.economicActivityName}
            value={economicActivityName}
            onChange={onEconomicActivityNameChange}
            disabled={isSubmitting}
          />
        </FormSection>

        <FormSection
          title={t.addressLocation}
          description={t.locationCatalogTemporaryHelperText}
        >
          <TextAreaField
            id={`${mode}-customer-address`}
            name="address"
            label={t.address}
            value={address}
            onChange={onAddressChange}
            disabled={isSubmitting}
          />
          <SelectField
            id={`${mode}-customer-province`}
            name="province_code"
            label={t.province}
            value={provinceCode}
            onChange={handleProvinceChange}
            disabled={isSubmitting}
            options={provinceOptions}
            errorMessage={fieldErrors.provinceCode}
          />
          <SelectField
            id={`${mode}-customer-canton`}
            name="canton_code"
            label={t.canton}
            value={cantonCode}
            onChange={handleCantonChange}
            disabled={
              isSubmitting || !provinceCode || availableCantons.length === 0
            }
            options={cantonOptions}
            errorMessage={fieldErrors.cantonCode}
          />
          <SelectField
            id={`${mode}-customer-district`}
            name="district_code"
            label={t.district}
            value={districtCode}
            onChange={handleDistrictChange}
            disabled={
              isSubmitting || !cantonCode || availableDistricts.length === 0
            }
            options={districtOptions}
            errorMessage={fieldErrors.districtCode}
          />
          <SelectField
            id={`${mode}-customer-neighborhood`}
            name="neighborhood_code"
            label={t.neighborhood}
            value={neighborhoodCode}
            onChange={handleNeighborhoodChange}
            disabled={
              isSubmitting ||
              !districtCode ||
              availableNeighborhoods.length === 0
            }
            options={neighborhoodOptions}
            errorMessage={fieldErrors.neighborhoodCode}
          />
          <TextAreaField
            id={`${mode}-customer-other-signs`}
            name="other_signs"
            label={t.otherSigns}
            value={otherSigns}
            onChange={onOtherSignsChange}
            disabled={isSubmitting}
          />
        </FormSection>

        <FormSection title={t.internalNotes}>
          <TextAreaField
            id={`${mode}-customer-notes`}
            name="notes"
            label={t.notes}
            value={notes}
            onChange={onNotesChange}
            disabled={isSubmitting}
          />
          <TextAreaField
            id={`${mode}-customer-fiscal-notes`}
            name="fiscal_notes"
            label={t.fiscalNotes}
            value={fiscalNotes}
            onChange={onFiscalNotesChange}
            disabled={isSubmitting}
          />
        </FormSection>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="app-button-primary inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
