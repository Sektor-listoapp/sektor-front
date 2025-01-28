import {
  PublicOrganizations,
  PublicSupplier,
  PublicBrokerageSociety,
  PublicExclusiveAgent,
  PublicInsuranceBroker,
  PublicInsuranceCompany,
} from "@/types/public";

export interface PublicOrganizationsStoreState {
  publicOrganizations: PublicOrganizations | null;
  isLoadingPublicOrganizations: boolean;
}

export interface PublicOrganizationsStoreActions {
  setIsLoadingPublicOrganizations: (isLoading: boolean) => void;
  setPublicOrganizations: (organizations: PublicOrganizations | null) => void;
  setPublicSuppliers: (suppliers: PublicSupplier[]) => void;
  setPublicExclusiveAgents: (exclusiveAgents: PublicExclusiveAgent[]) => void;
  setPublicInsuranceCompanies: (
    insuranceCompanies: PublicInsuranceCompany[]
  ) => void;
  setPublicBrokerageSocieties: (
    brokerageSocieties: PublicBrokerageSociety[]
  ) => void;
  setPublicInsuranceBrokers: (
    insuranceBrokers: PublicInsuranceBroker[]
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
