import {
  BrokerageSocietyType,
  ExclusiveAgentType,
  InsuranceBrokerType,
  InsuranceCompanyType,
  SupplierType,
} from "@/lib/sektor-api/__generated__/types";

export interface OrganizationAddress {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface PublicOrganizations {
  suppliers?: SupplierType[] | null;
  exclusiveAgents?: ExclusiveAgentType[] | null;
  insuranceBrokers?: InsuranceBrokerType[] | null;
  brokerageSocieties?: BrokerageSocietyType[] | null;
  insuranceCompanies?: InsuranceCompanyType[] | null;
}
