import { OrganizationTypes } from "@/lib/sektor-api/__generated__/types";
import dynamic from "next/dynamic";

const {
  Supplier,
  BrokerageSociety,
  ExclusiveAgent,
  InsuranceBroker,
  InsuranceCompany,
} = OrganizationTypes;

export const ORGANIZATION_DETAILS_CONTENT_MAP = {
  [Supplier]: dynamic(() => import("./supplier")),
  [ExclusiveAgent]: dynamic(() => import("./exclusive-agent")),
  [InsuranceBroker]: dynamic(() => import("./insurance-broker")),
  [InsuranceCompany]: dynamic(() => import("./insurance-company")),
  [BrokerageSociety]: dynamic(() => import("./brokerage-society")),
} as const;
