import { OperationVariables } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";
import { SERVICE_SUPPLIER_TYPES, USER_TYPES } from "@/constants/shared";
import { getCurrentFiltersFromQuery } from "./get-current-filters-from-query";

type OrganizationQueryVariables = {
  pagination: { offset: number; limit: number };
  publicSupplierFilters: unknown;
  publicWorkshopFilters: unknown;
  publicExclusiveAgentFilters: unknown;
  publicInsuranceBrokersFilters: unknown;
  publicInsuranceCompanyFilters: unknown;
  publicBrokerageSocietyFilters: unknown;
};

const getSelectedType = (query: ParsedUrlQuery) => {
  const { type } = query;
  return Array.isArray(type) ? type[0] : type;
};

const shouldFetchWorkshops = (selectedType?: string) =>
  !selectedType || selectedType === USER_TYPES.SUPPLIER_WORKSHOP;

export const buildOrganizationQueryVariables = (
  query: ParsedUrlQuery,
  pagination: { offset: number; limit: number },
  extraVariables?: OperationVariables
): OrganizationQueryVariables => {
  const currentFilters = getCurrentFiltersFromQuery(query) as Record<
    string,
    unknown
  >;
  const selectedType = getSelectedType(query);
  const workshopFilters = currentFilters.publicWorkshopFilters as
    | Record<string, unknown>
    | undefined;

  return {
    pagination,
    publicSupplierFilters: currentFilters.publicSupplierFilters ?? null,
    publicWorkshopFilters: shouldFetchWorkshops(selectedType)
      ? workshopFilters ?? { serviceType: SERVICE_SUPPLIER_TYPES.WORKSHOP }
      : null,
    publicExclusiveAgentFilters:
      currentFilters.publicExclusiveAgentFilters ?? null,
    publicInsuranceBrokersFilters:
      currentFilters.publicInsuranceBrokersFilters ?? null,
    publicInsuranceCompanyFilters:
      currentFilters.publicInsuranceCompanyFilters ?? null,
    publicBrokerageSocietyFilters:
      currentFilters.publicBrokerageSocietyFilters ?? null,
    ...extraVariables,
  };
};
