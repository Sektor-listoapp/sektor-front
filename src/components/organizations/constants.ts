import { USER_TYPES } from "@/constants/shared";
import InsuranceBrokers from "./insurance-brokers";
import BrokerageSocieties from "./brokerage-societies";
import ExclusiveAgents from "./exclusive-agents";
import InsuranceCompanies from "./insurance-companies";
import Suppliers from "./suppliers";

const {
  INSURANCE_BROKER,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  INSURANCE_COMPANY,
  INSURANCE_COMPANY_COOPERATIVE,
  INSURANCE_COMPANY_INSURTECH,
  INSURANCE_COMPANY_PREPAID_MEDICINE,
  SUPPLIER,
} = USER_TYPES;

export const ORGANIZATION_COMPONENTS = [
  {
    type: INSURANCE_BROKER,
    component: InsuranceBrokers,
  },
  {
    type: BROKERAGE_SOCIETY,
    component: BrokerageSocieties,
  },
  {
    type: EXCLUSIVE_AGENT,
    component: ExclusiveAgents,
  },
  {
    type: INSURANCE_COMPANY,
    component: InsuranceCompanies,
  },
  {
    type: INSURANCE_COMPANY_COOPERATIVE,
    component: InsuranceCompanies,
  },
  {
    type: INSURANCE_COMPANY_PREPAID_MEDICINE,
    component: InsuranceCompanies,
  },
  {
    type: INSURANCE_COMPANY_INSURTECH,
    component: InsuranceCompanies,
  },
  {
    type: SUPPLIER,
    component: Suppliers,
  },
] as const;
