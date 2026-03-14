import { USER_TYPES } from "../shared";

const {
  INSURANCE_BROKER,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  SUPPLIER,
  INSURANCE_COMPANY,
  INSURANCE_COMPANY_COOPERATIVE,
  INSURANCE_COMPANY_INSURTECH,
  INSURANCE_COMPANY_PREPAID_MEDICINE,
} = USER_TYPES;

export const ORGANIZATION_FILTER_KEYS = {
  [SUPPLIER]: "publicSupplierFilters",
  [BROKERAGE_SOCIETY]: "publicBrokerageSocietyFilters",
  [EXCLUSIVE_AGENT]: "publicExclusiveAgentFilters",
  [INSURANCE_BROKER]: "publicInsuranceBrokersFilters",
  [INSURANCE_COMPANY]: "publicInsuranceCompanyFilters",
  [INSURANCE_COMPANY_COOPERATIVE]: "publicInsuranceCompanyFilters",
  [INSURANCE_COMPANY_INSURTECH]: "publicInsuranceCompanyFilters",
  [INSURANCE_COMPANY_PREPAID_MEDICINE]: "publicInsuranceCompanyFilters",
};
