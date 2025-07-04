import { OrganizationTypes, UserGroups } from "@/lib/sektor-api/__generated__/types";
import dynamic from "next/dynamic";

const {
  BrokerageSociety,
  ExclusiveAgent,
  InsuranceBroker,
  InsuranceCompany,
  Supplier,
} = OrganizationTypes;

const { Customer } = UserGroups;

export const USER_FORM = {
  [Supplier]: dynamic(() => import("@/components/my-account/supplier-form")),
  [ExclusiveAgent]: dynamic(() => import("@/components/my-account/exclusive-agent-form")),
  [InsuranceBroker]: dynamic(() => import("@/components/my-account/insurance-broker-form")),
  [InsuranceCompany]: dynamic(() => import("@/components/my-account/insurance-company-form")),
  [BrokerageSociety]: dynamic(() => import("@/components/my-account/brokerage-society-form")),
  [Customer]: dynamic(() => import("@/components/my-account/customer-form")),
} as const;