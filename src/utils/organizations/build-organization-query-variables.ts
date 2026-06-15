import { OperationVariables } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";
import { getCurrentFiltersFromQuery } from "./get-current-filters-from-query";

type OrganizationQueryVariables = {
  pagination: { offset: number; limit: number };
  publicSupplierFilters: unknown;
  publicExclusiveAgentFilters: unknown;
  publicInsuranceBrokersFilters: unknown;
  publicInsuranceCompanyFilters: unknown;
  publicBrokerageSocietyFilters: unknown;
};

export const buildOrganizationQueryVariables = (
  query: ParsedUrlQuery,
  pagination: { offset: number; limit: number },
  extraVariables?: OperationVariables
): OrganizationQueryVariables => {
  const currentFilters = getCurrentFiltersFromQuery(query) as Record<
    string,
    unknown
  >;

  return {
    pagination,
    publicSupplierFilters: currentFilters.publicSupplierFilters ?? null,
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
