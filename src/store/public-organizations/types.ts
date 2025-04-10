import {
  BrokerageSocietyType,
  ExclusiveAgentType,
  InsuranceBrokerType,
  InsuranceCompanyType,
  SupplierType,
} from "@/lib/sektor-api/__generated__/types";
import { PublicOrganizations } from "@/types/public";

export interface PublicOrganizationsStoreState {
  publicOrganizations: PublicOrganizations | null;
  isLoadingPublicOrganizations: boolean;
}

export interface PublicOrganizationsStoreActions {
  setIsLoadingPublicOrganizations: (isLoading: boolean) => void;
  setPublicOrganizations: (organizations: PublicOrganizations | null) => void;
  setPublicSuppliers: (suppliers: SupplierType[]) => void;
  setPublicExclusiveAgents: (exclusiveAgents: ExclusiveAgentType[]) => void;
  setPublicInsuranceCompanies: (
    insuranceCompanies: InsuranceCompanyType[]
  ) => void;
  setPublicBrokerageSocieties: (
    brokerageSocieties: BrokerageSocietyType[]
  ) => void;
  setPublicInsuranceBrokers: (insuranceBrokers: InsuranceBrokerType[]) => void;
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
