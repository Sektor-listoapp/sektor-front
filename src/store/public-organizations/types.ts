import {
  BrokerageSocietyType,
  ExclusiveAgentType,
  InsuranceBrokerType,
  InsuranceCompanyType,
  SupplierType,
} from "@/lib/sektor-api/__generated__/types";
import { PublicOrganizations, OrganizationPaginationInfo } from "@/types/public";

export interface PublicOrganizationsStoreState {
  publicOrganizations: PublicOrganizations | null;
  isLoadingPublicOrganizations: boolean;
}

export interface PublicOrganizationsStoreActions {
  setIsLoadingPublicOrganizations: (isLoading: boolean) => void;
  setPublicOrganizations: (organizations: PublicOrganizations | null) => void;
  setPublicSuppliers: (
    suppliers: SupplierType[],
    paginationInfo?: OrganizationPaginationInfo | null
  ) => void;
  setPublicExclusiveAgents: (
    exclusiveAgents: ExclusiveAgentType[],
    paginationInfo?: OrganizationPaginationInfo | null
  ) => void;
  setPublicInsuranceCompanies: (
    insuranceCompanies: InsuranceCompanyType[],
    paginationInfo?: OrganizationPaginationInfo | null
  ) => void;
  setPublicBrokerageSocieties: (
    brokerageSocieties: BrokerageSocietyType[],
    paginationInfo?: OrganizationPaginationInfo | null
  ) => void;
  setPublicInsuranceBrokers: (
    insuranceBrokers: InsuranceBrokerType[],
    paginationInfo?: OrganizationPaginationInfo | null
  ) => void;
  resetPublicOrganizations: () => void;
}

export type PublicOrganizationsStore = PublicOrganizationsStoreState &
  PublicOrganizationsStoreActions;

export interface PublicOrganizationsStoreSetter {
  (
    partial:
      | PublicOrganizationsStore
      | Partial<PublicOrganizationsStore>
      | ((
        state: PublicOrganizationsStore
      ) => PublicOrganizationsStore | Partial<PublicOrganizationsStore>),
    replace?: false | undefined,
    action?: string | undefined
  ): void;
  (
    state:
      | PublicOrganizationsStore
      | ((state: PublicOrganizationsStore) => PublicOrganizationsStore),
    replace: true,
    action?: string | undefined
  ): void;
}

export type PublicOrganizationsStoreGetter = () => PublicOrganizationsStore;
