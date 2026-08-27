"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AccessDeniedState } from "@/components/admin/AccessDeniedState";
import { AdminShell } from "@/components/admin/AdminShell";
import { CustomerForm } from "@/components/admin/customers/CustomerForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusMessage } from "@/components/admin/StatusMessage";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { clearStoredAuth } from "@/lib/auth-storage";
import type { Customer } from "@/lib/customers-api";
import { useI18n } from "@/lib/i18n/use-i18n";
import { INACTIVE_ACCOUNT_LOGIN_PATH } from "@/lib/inactive-account";
import {
  hasPermission,
  LOOKUP_TAXPAYER_PERMISSION,
  MANAGE_CUSTOMERS_PERMISSION,
  VIEW_CUSTOMERS_PERMISSION,
} from "@/lib/permissions";
import { productDisplayName } from "@/lib/product-info";
import { useCreateCustomer } from "@/lib/use-create-customer";
import { useCustomers } from "@/lib/use-customers";
import { useEditCustomer } from "@/lib/use-edit-customer";
import { useProtectedAdminSession } from "@/lib/use-protected-admin-session";

function formatIdentification(customer: Customer, unavailable: string) {
  const identificationParts = [
    customer.identification_type,
    customer.identification_number,
  ].filter(Boolean);

  return identificationParts.length > 0
    ? identificationParts.join(" ")
    : unavailable;
}

function CustomersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages: t } = useI18n();
  const {
    errorMessage,
    isLoggingOut,
    logout,
    status,
    trustedUser,
    userDisplayName,
  } = useProtectedAdminSession();
  const [searchQuery, setSearchQuery] = useState("");
  const createCustomerFormRef = useRef<HTMLDivElement>(null);
  const hasAppliedCreateCustomerIntentRef = useRef(false);
  const appliedEditCustomerIntentKeyRef = useRef("");
  const [shouldAutoFocusCreateCustomerForm, setShouldAutoFocusCreateCustomerForm] =
    useState(false);
  const canViewCustomers = hasPermission(
    trustedUser,
    VIEW_CUSTOMERS_PERMISSION,
  );
  const canManageCustomers = hasPermission(
    trustedUser,
    MANAGE_CUSTOMERS_PERMISSION,
  );
  const canLookupTaxpayer = hasPermission(
    trustedUser,
    LOOKUP_TAXPAYER_PERMISSION,
  );
  const handleUnauthorized = useCallback(() => {
    clearStoredAuth();
    router.replace("/login");
  }, [router]);
  const handleInactiveAccount = useCallback(() => {
    clearStoredAuth();
    router.replace(INACTIVE_ACCOUNT_LOGIN_PATH);
  }, [router]);
  const customersFlow = useCustomers({
    onInactiveAccount: handleInactiveAccount,
    onUnauthorized: handleUnauthorized,
  });
  const {
    customers,
    errorMessage: customersErrorMessage,
    isRefreshing,
    loadCustomers,
    refreshCustomers,
    status: customersStatus,
  } = customersFlow;
  const refreshCustomerList = useCallback(() => {
    loadCustomers();
  }, [loadCustomers]);
  const findCustomersByIdentificationNumber = useCallback(
    (identificationNumber: string) => {
      const normalizedIdentificationNumber = identificationNumber.trim();

      if (!normalizedIdentificationNumber) {
        return [];
      }

      return customers.filter(
        (customer) =>
          (customer.identification_number ?? "").trim() ===
          normalizedIdentificationNumber,
      );
    },
    [customers],
  );
  const createCustomerFlow = useCreateCustomer({
    findCustomersByIdentificationNumber,
    onCustomerCreated: refreshCustomerList,
    onInactiveAccount: handleInactiveAccount,
    onUnauthorized: handleUnauthorized,
  });
  const editCustomerFlow = useEditCustomer({
    onCustomerUpdated: refreshCustomerList,
    onInactiveAccount: handleInactiveAccount,
    onUnauthorized: handleUnauthorized,
  });
  const cancelCreateCustomerForm = createCustomerFlow.cancelForm;
  const showCreateCustomerFormPanel = createCustomerFlow.showForm;
  const cancelEditCustomerForm = editCustomerFlow.cancelEditing;
  const startEditingCustomerForm = editCustomerFlow.startEditingCustomer;
  const normalizedSearchQuery = searchQuery.trim().replace(/\s+/g, " ");
  const displayedCustomers = useMemo(() => {
    const normalizedQuery = normalizedSearchQuery.toLowerCase();

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) => {
      const statusLabel = customer.is_active ? t.active : t.inactive;
      const searchableText = [
        customer.id.toString(),
        customer.name,
        customer.legal_name,
        customer.commercial_name,
        customer.email,
        customer.fiscal_email,
        customer.economic_activity_code,
        customer.economic_activity_name,
        customer.phone,
        customer.identification_type,
        customer.identification_number,
        customer.province,
        customer.province_code,
        customer.province_name,
        customer.canton,
        customer.canton_code,
        customer.canton_name,
        customer.district,
        customer.district_code,
        customer.district_name,
        customer.neighborhood,
        customer.neighborhood_code,
        customer.neighborhood_name,
        statusLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [customers, normalizedSearchQuery, t.active, t.inactive]);
  const emptyMessage =
    customers.length > 0 && normalizedSearchQuery
      ? t.noCustomersMatchSearch
      : t.noCustomersFound;
  const isAccessDenied =
    (status === "ready" && !canViewCustomers) ||
    customersStatus === "access_denied";

  const handleSearchQueryChange = useCallback((nextSearchQuery: string) => {
    setSearchQuery(nextSearchQuery);
  }, []);

  const showCreateCustomerForm = useCallback(
    ({ shouldFocus = false }: { shouldFocus?: boolean } = {}) => {
      cancelEditCustomerForm();
      showCreateCustomerFormPanel();
      setShouldAutoFocusCreateCustomerForm(shouldFocus);
    },
    [cancelEditCustomerForm, showCreateCustomerFormPanel],
  );

  const startEditingCustomer = useCallback(
    (customer: Customer) => {
      cancelCreateCustomerForm();
      setShouldAutoFocusCreateCustomerForm(false);
      startEditingCustomerForm(customer);
    },
    [cancelCreateCustomerForm, startEditingCustomerForm],
  );
  const openLocalTaxpayerLookupCustomer = useCallback(() => {
    const localCustomerMatch =
      createCustomerFlow.taxpayerLookupLocalCustomerMatch;

    if (localCustomerMatch?.status !== "single") {
      return;
    }

    startEditingCustomer(localCustomerMatch.customer);
  }, [createCustomerFlow.taxpayerLookupLocalCustomerMatch, startEditingCustomer]);

  useEffect(() => {
    if (status !== "ready" || !canViewCustomers) {
      return;
    }

    let isCurrent = true;

    Promise.resolve().then(() => {
      if (!isCurrent) {
        return;
      }

      loadCustomers({ shouldApplyResult: () => isCurrent });
    });

    return () => {
      isCurrent = false;
    };
  }, [canViewCustomers, loadCustomers, status]);

  useEffect(() => {
    const search = searchParams.get("search");

    if (status !== "ready" || !canViewCustomers || search === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleSearchQueryChange(search);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canViewCustomers, handleSearchQueryChange, searchParams, status]);

  useEffect(() => {
    const intent = searchParams.get("intent");

    if (
      status !== "ready" ||
      !canManageCustomers ||
      intent !== "create-customer" ||
      hasAppliedCreateCustomerIntentRef.current
    ) {
      return;
    }

    hasAppliedCreateCustomerIntentRef.current = true;
    appliedEditCustomerIntentKeyRef.current = "";
    showCreateCustomerForm({ shouldFocus: true });

    window.setTimeout(() => {
      createCustomerFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [canManageCustomers, searchParams, showCreateCustomerForm, status]);

  useEffect(() => {
    const intent = searchParams.get("intent");
    const search = searchParams.get("search");
    const normalizedIntentSearch = search?.trim().replace(/\s+/g, " ") ?? "";

    if (
      status !== "ready" ||
      customersStatus !== "ready" ||
      !canManageCustomers ||
      intent !== "edit-customer" ||
      !normalizedIntentSearch ||
      normalizedIntentSearch !== normalizedSearchQuery ||
      appliedEditCustomerIntentKeyRef.current === normalizedIntentSearch
    ) {
      return;
    }

    appliedEditCustomerIntentKeyRef.current = normalizedIntentSearch;
    hasAppliedCreateCustomerIntentRef.current = false;

    const [matchedCustomer] = displayedCustomers;

    if (displayedCustomers.length !== 1 || !matchedCustomer) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startEditingCustomer(matchedCustomer);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    canManageCustomers,
    customersStatus,
    displayedCustomers,
    normalizedSearchQuery,
    searchParams,
    startEditingCustomer,
    status,
  ]);

  return (
    <AdminShell
      userDisplayName={userDisplayName}
      trustedUser={trustedUser}
      isLoggingOut={isLoggingOut}
      onLogout={logout}
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow={productDisplayName}
          title={t.customerManagement}
          description={t.customersDescription}
          rightBadge={canManageCustomers ? t.manageCustomers : t.readOnly}
        />

        {status === "checking" ? (
          <StatusMessage variant="info" className="mt-6">
            {t.validatingSession}
          </StatusMessage>
        ) : null}

        {status === "error" ? (
          <StatusMessage variant="error" className="mt-6">
            {errorMessage}
          </StatusMessage>
        ) : null}

        {isAccessDenied ? (
          <AccessDeniedState
            title={t.customersAccessDenied}
            description={t.customersAccessDeniedDescription}
          />
        ) : null}

        {!isAccessDenied && status === "ready" ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SummaryCard
                title={t.customers}
                status={customers.length.toString()}
                description={t.customersDescription}
              />
              <SummaryCard
                title={canManageCustomers ? t.manageCustomers : t.readOnly}
                status={
                  canManageCustomers
                    ? MANAGE_CUSTOMERS_PERMISSION
                    : VIEW_CUSTOMERS_PERMISSION
                }
                description={
                  canManageCustomers
                    ? t.customersManageDescription
                    : t.customersReadOnlyDescription
                }
              />
            </div>

            <section className="app-card mt-6 rounded-lg border">
              <div className="app-divider flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="app-text text-base font-semibold">
                    {t.customers}
                  </h2>
                  <p className="app-subtle mt-1 text-sm">
                    {t.customersDescription}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canManageCustomers ? (
                    <button
                      type="button"
                      onClick={() =>
                        showCreateCustomerForm({ shouldFocus: true })
                      }
                      disabled={
                        customersStatus === "loading" ||
                        createCustomerFlow.isSubmitting ||
                        editCustomerFlow.isSubmitting
                      }
                      className="app-button-primary inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                    >
                      {t.createCustomer}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={refreshCustomers}
                    disabled={customersStatus === "loading" || isRefreshing}
                    className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                  >
                    {isRefreshing ? t.refreshingCustomers : t.refreshCustomers}
                  </button>
                </div>
              </div>

              {customersStatus === "loading" ? (
                <StatusMessage variant="info" className="px-5 py-5">
                  {isRefreshing ? t.refreshingCustomers : t.loadingCustomers}
                </StatusMessage>
              ) : null}

              {customersStatus === "error" ? (
                <StatusMessage variant="error" className="m-5">
                  {customersErrorMessage}
                </StatusMessage>
              ) : null}

              {customersStatus === "ready" ? (
                <>
                  {canManageCustomers && createCustomerFlow.isFormVisible ? (
                    <div ref={createCustomerFormRef}>
                      <CustomerForm
                        mode="create"
                        name={createCustomerFlow.name}
                        legalName={createCustomerFlow.legalName}
                        commercialName={createCustomerFlow.commercialName}
                        email={createCustomerFlow.email}
                        fiscalEmail={createCustomerFlow.fiscalEmail}
                        economicActivityCode={
                          createCustomerFlow.economicActivityCode
                        }
                        economicActivityName={
                          createCustomerFlow.economicActivityName
                        }
                        phone={createCustomerFlow.phone}
                        identificationType={
                          createCustomerFlow.identificationType
                        }
                        identificationNumber={
                          createCustomerFlow.identificationNumber
                        }
                        address={createCustomerFlow.address}
                        province={createCustomerFlow.province}
                        provinceCode={createCustomerFlow.provinceCode}
                        provinceName={createCustomerFlow.provinceName}
                        canton={createCustomerFlow.canton}
                        cantonCode={createCustomerFlow.cantonCode}
                        cantonName={createCustomerFlow.cantonName}
                        district={createCustomerFlow.district}
                        districtCode={createCustomerFlow.districtCode}
                        districtName={createCustomerFlow.districtName}
                        neighborhood={createCustomerFlow.neighborhood}
                        neighborhoodCode={createCustomerFlow.neighborhoodCode}
                        neighborhoodName={createCustomerFlow.neighborhoodName}
                        otherSigns={createCustomerFlow.otherSigns}
                        notes={createCustomerFlow.notes}
                        fiscalNotes={createCustomerFlow.fiscalNotes}
                        isActive={createCustomerFlow.isActive}
                        shouldAutoFocusName={shouldAutoFocusCreateCustomerForm}
                        isSubmitting={createCustomerFlow.isSubmitting}
                        errorMessages={createCustomerFlow.errorMessages}
                        fieldErrors={createCustomerFlow.fieldErrors}
                        canLookupTaxpayer={canLookupTaxpayer}
                        isLookingUpTaxpayer={
                          createCustomerFlow.isLookingUpTaxpayer
                        }
                        taxpayerLookupResult={
                          createCustomerFlow.taxpayerLookupResult
                        }
                        taxpayerLookupErrorMessage={
                          createCustomerFlow.taxpayerLookupErrorMessage
                        }
                        taxpayerLookupLocalCustomerMatch={
                          createCustomerFlow.taxpayerLookupLocalCustomerMatch
                            ?.status ?? null
                        }
                        selectedTaxpayerEconomicActivityCode={
                          createCustomerFlow.selectedTaxpayerEconomicActivityCode
                        }
                        onNameChange={createCustomerFlow.setName}
                        onLegalNameChange={createCustomerFlow.setLegalName}
                        onCommercialNameChange={
                          createCustomerFlow.setCommercialName
                        }
                        onEmailChange={createCustomerFlow.setEmail}
                        onFiscalEmailChange={createCustomerFlow.setFiscalEmail}
                        onEconomicActivityCodeChange={
                          createCustomerFlow.setEconomicActivityCode
                        }
                        onEconomicActivityNameChange={
                          createCustomerFlow.setEconomicActivityName
                        }
                        onPhoneChange={createCustomerFlow.setPhone}
                        onIdentificationTypeChange={
                          createCustomerFlow.setIdentificationType
                        }
                        onIdentificationNumberChange={
                          createCustomerFlow.setIdentificationNumber
                        }
                        onAddressChange={createCustomerFlow.setAddress}
                        onProvinceChange={createCustomerFlow.setProvince}
                        onProvinceCodeChange={
                          createCustomerFlow.setProvinceCode
                        }
                        onProvinceNameChange={
                          createCustomerFlow.setProvinceName
                        }
                        onCantonChange={createCustomerFlow.setCanton}
                        onCantonCodeChange={createCustomerFlow.setCantonCode}
                        onCantonNameChange={createCustomerFlow.setCantonName}
                        onDistrictChange={createCustomerFlow.setDistrict}
                        onDistrictCodeChange={
                          createCustomerFlow.setDistrictCode
                        }
                        onDistrictNameChange={
                          createCustomerFlow.setDistrictName
                        }
                        onNeighborhoodChange={
                          createCustomerFlow.setNeighborhood
                        }
                        onNeighborhoodCodeChange={
                          createCustomerFlow.setNeighborhoodCode
                        }
                        onNeighborhoodNameChange={
                          createCustomerFlow.setNeighborhoodName
                        }
                        onOtherSignsChange={createCustomerFlow.setOtherSigns}
                        onNotesChange={createCustomerFlow.setNotes}
                        onFiscalNotesChange={createCustomerFlow.setFiscalNotes}
                        onIsActiveChange={createCustomerFlow.setIsActive}
                        onSubmit={createCustomerFlow.submit}
                        onCancel={createCustomerFlow.cancelForm}
                        onClearErrorMessages={
                          createCustomerFlow.clearErrorMessages
                        }
                        onLookupTaxpayer={createCustomerFlow.lookupTaxpayer}
                        onApplyTaxpayerData={
                          createCustomerFlow.applyTaxpayerData
                        }
                        onOpenExistingCustomer={
                          openLocalTaxpayerLookupCustomer
                        }
                        onSelectedTaxpayerEconomicActivityCodeChange={
                          createCustomerFlow.setSelectedTaxpayerEconomicActivityCode
                        }
                      />
                    </div>
                  ) : null}

                  {canManageCustomers && editCustomerFlow.isFormVisible ? (
                    <CustomerForm
                      mode="edit"
                      name={editCustomerFlow.name}
                      legalName={editCustomerFlow.legalName}
                      commercialName={editCustomerFlow.commercialName}
                      email={editCustomerFlow.email}
                      fiscalEmail={editCustomerFlow.fiscalEmail}
                      economicActivityCode={
                        editCustomerFlow.economicActivityCode
                      }
                      economicActivityName={
                        editCustomerFlow.economicActivityName
                      }
                      phone={editCustomerFlow.phone}
                      identificationType={editCustomerFlow.identificationType}
                      identificationNumber={
                        editCustomerFlow.identificationNumber
                      }
                      address={editCustomerFlow.address}
                      province={editCustomerFlow.province}
                      provinceCode={editCustomerFlow.provinceCode}
                      provinceName={editCustomerFlow.provinceName}
                      canton={editCustomerFlow.canton}
                      cantonCode={editCustomerFlow.cantonCode}
                      cantonName={editCustomerFlow.cantonName}
                      district={editCustomerFlow.district}
                      districtCode={editCustomerFlow.districtCode}
                      districtName={editCustomerFlow.districtName}
                      neighborhood={editCustomerFlow.neighborhood}
                      neighborhoodCode={editCustomerFlow.neighborhoodCode}
                      neighborhoodName={editCustomerFlow.neighborhoodName}
                      otherSigns={editCustomerFlow.otherSigns}
                      notes={editCustomerFlow.notes}
                      fiscalNotes={editCustomerFlow.fiscalNotes}
                      isActive={editCustomerFlow.isActive}
                      isSubmitting={editCustomerFlow.isSubmitting}
                      errorMessages={editCustomerFlow.errorMessages}
                      fieldErrors={editCustomerFlow.fieldErrors}
                      canLookupTaxpayer={canLookupTaxpayer}
                      isLookingUpTaxpayer={editCustomerFlow.isLookingUpTaxpayer}
                      taxpayerLookupResult={editCustomerFlow.taxpayerLookupResult}
                      taxpayerLookupErrorMessage={
                        editCustomerFlow.taxpayerLookupErrorMessage
                      }
                      taxpayerLookupLocalCustomerMatch={null}
                      selectedTaxpayerEconomicActivityCode={
                        editCustomerFlow.selectedTaxpayerEconomicActivityCode
                      }
                      onNameChange={editCustomerFlow.setName}
                      onLegalNameChange={editCustomerFlow.setLegalName}
                      onCommercialNameChange={editCustomerFlow.setCommercialName}
                      onEmailChange={editCustomerFlow.setEmail}
                      onFiscalEmailChange={editCustomerFlow.setFiscalEmail}
                      onEconomicActivityCodeChange={
                        editCustomerFlow.setEconomicActivityCode
                      }
                      onEconomicActivityNameChange={
                        editCustomerFlow.setEconomicActivityName
                      }
                      onPhoneChange={editCustomerFlow.setPhone}
                      onIdentificationTypeChange={
                        editCustomerFlow.setIdentificationType
                      }
                      onIdentificationNumberChange={
                        editCustomerFlow.setIdentificationNumber
                      }
                      onAddressChange={editCustomerFlow.setAddress}
                      onProvinceChange={editCustomerFlow.setProvince}
                      onProvinceCodeChange={editCustomerFlow.setProvinceCode}
                      onProvinceNameChange={editCustomerFlow.setProvinceName}
                      onCantonChange={editCustomerFlow.setCanton}
                      onCantonCodeChange={editCustomerFlow.setCantonCode}
                      onCantonNameChange={editCustomerFlow.setCantonName}
                      onDistrictChange={editCustomerFlow.setDistrict}
                      onDistrictCodeChange={editCustomerFlow.setDistrictCode}
                      onDistrictNameChange={editCustomerFlow.setDistrictName}
                      onNeighborhoodChange={editCustomerFlow.setNeighborhood}
                      onNeighborhoodCodeChange={
                        editCustomerFlow.setNeighborhoodCode
                      }
                      onNeighborhoodNameChange={
                        editCustomerFlow.setNeighborhoodName
                      }
                      onOtherSignsChange={editCustomerFlow.setOtherSigns}
                      onNotesChange={editCustomerFlow.setNotes}
                      onFiscalNotesChange={editCustomerFlow.setFiscalNotes}
                      onIsActiveChange={editCustomerFlow.setIsActive}
                      onSubmit={editCustomerFlow.submit}
                      onCancel={editCustomerFlow.cancelEditing}
                      onClearErrorMessages={editCustomerFlow.clearErrorMessages}
                      onLookupTaxpayer={editCustomerFlow.lookupTaxpayer}
                      onApplyTaxpayerData={editCustomerFlow.applyTaxpayerData}
                      onSelectedTaxpayerEconomicActivityCodeChange={
                        editCustomerFlow.setSelectedTaxpayerEconomicActivityCode
                      }
                    />
                  ) : null}

                  <div className="app-divider border-b px-5 py-4">
                    <label
                      htmlFor="customers-search"
                      className="app-muted block text-sm font-medium"
                    >
                      {t.searchCustomers}
                    </label>
                    <div className="mt-2 flex max-w-xl gap-2">
                      <input
                        id="customers-search"
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                          handleSearchQueryChange(event.target.value)
                        }
                        placeholder={t.searchCustomersPlaceholder}
                        className="app-input block h-10 min-w-0 flex-1 rounded-md border px-3 text-sm shadow-sm outline-none transition-colors"
                      />
                      {searchQuery ? (
                        <button
                          type="button"
                          onClick={() => handleSearchQueryChange("")}
                          className="app-button-secondary inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2"
                          aria-label={t.clearSearch}
                        >
                          {t.clearSearch}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {displayedCustomers.length === 0 ? (
                    <p className="app-muted px-5 py-8 text-center text-sm">
                      {emptyMessage}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[var(--app-border)] text-left text-sm">
                        <thead className="app-table-head">
                          <tr>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.id}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.name}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.email}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.phone}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.identification}
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase">
                              {t.status}
                            </th>
                            {canManageCustomers ? (
                              <th className="px-5 py-3 text-xs font-semibold uppercase">
                                {t.actions}
                              </th>
                            ) : null}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--app-border)]">
                          {displayedCustomers.map((customer) => (
                            <tr key={customer.id}>
                              <td className="app-text whitespace-nowrap px-5 py-4 font-medium">
                                {customer.id}
                              </td>
                              <td className="app-text whitespace-nowrap px-5 py-4 font-medium">
                                {customer.name}
                              </td>
                              <td className="app-muted whitespace-nowrap px-5 py-4">
                                {customer.email ?? t.unavailable}
                              </td>
                              <td className="app-muted whitespace-nowrap px-5 py-4">
                                {customer.phone ?? t.unavailable}
                              </td>
                              <td className="app-muted whitespace-nowrap px-5 py-4">
                                {formatIdentification(customer, t.unavailable)}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${
                                    customer.is_active
                                      ? "app-badge-success"
                                      : "app-badge-warning"
                                  }`}
                                >
                                  {customer.is_active ? t.active : t.inactive}
                                </span>
                              </td>
                              {canManageCustomers ? (
                                <td className="px-5 py-4">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditingCustomer(customer)
                                    }
                                    disabled={
                                      createCustomerFlow.isSubmitting ||
                                      editCustomerFlow.isSubmitting
                                    }
                                    className="app-button-secondary inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-focus)] focus:ring-offset-2 disabled:cursor-not-allowed"
                                  >
                                    {t.edit}
                                  </button>
                                </td>
                              ) : null}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersContent />
    </Suspense>
  );
}
