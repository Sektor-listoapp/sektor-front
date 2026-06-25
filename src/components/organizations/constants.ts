import { USER_TYPES } from "@/constants/shared";
import InsuranceBrokers from "./insurance-brokers";
import BrokerageSocieties from "./brokerage-societies";
import ExclusiveAgents from "./exclusive-agents";
import InsuranceCompanies from "./insurance-companies";
import Suppliers from "./suppliers";
import Workshops from "./workshops";

const {
  INSURANCE_BROKER,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  INSURANCE_COMPANY,
  SUPPLIER,
  SUPPLIER_WORKSHOP,
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
    type: SUPPLIER,
    component: Suppliers,
  },
  {
    type: SUPPLIER_WORKSHOP,
    component: Workshops,
  },
] as const;
