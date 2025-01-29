import { USER_TYPES } from "../shared";

const {
  INSURANCE_BROKER,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  SUPPLIER,
  INSURANCE_COMPANY,
} = USER_TYPES;

export const ORGANIZATION_FILTER_KEYS = {
  [SUPPLIER]: "publicSupplierFilters",
  [BROKERAGE_SOCIETY]: "publicBrokerageSocietyFilters",
  [EXCLUSIVE_AGENT]: "publicExclusiveAgentFilters",
  [INSURANCE_BROKER]: "publicInsuranceBrokersFilters",
  [INSURANCE_COMPANY]: "publicInsuranceCompanyFilters",
};
