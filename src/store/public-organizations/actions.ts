import { initialPublicOrganizationsStoreState } from "./initial-state";
import {
  PublicOrganizationsStoreActions,
  PublicOrganizationsStoreSetter,
} from "./types";

export const publicRegistrationsStoreActions = (
  set: PublicOrganizationsStoreSetter
): PublicOrganizationsStoreActions => ({
  setIsLoadingPublicOrganizations: (isLoadingPublicOrganizations) => {
    set(
      { isLoadingPublicOrganizations },
      false,
      "setIsLoadingPublicOrganizations"
    );
  },
  setPublicOrganizations: (publicOrganizations) => {
    set({ publicOrganizations }, false, "setPublicOrganizations");
  },
  setPublicSuppliers: (publicSuppliers, paginationInfo) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            suppliers: publicSuppliers,
            exclusiveAgents: state.publicOrganizations?.exclusiveAgents,
            insuranceBrokers: state.publicOrganizations?.insuranceBrokers,
            brokerageSocieties: state.publicOrganizations?.brokerageSocieties,
            insuranceCompanies: state.publicOrganizations?.insuranceCompanies,
            pagination: {
              ...state.publicOrganizations?.pagination,
              suppliers: paginationInfo,
            },
          },
        };
      },
      false,
      "setPublicSuppliers"
    );
  },
  setPublicExclusiveAgents: (publicExclusiveAgents, paginationInfo) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            suppliers: state.publicOrganizations?.suppliers,
            exclusiveAgents: publicExclusiveAgents,
            insuranceBrokers: state.publicOrganizations?.insuranceBrokers,
            brokerageSocieties: state.publicOrganizations?.brokerageSocieties,
            insuranceCompanies: state.publicOrganizations?.insuranceCompanies,
            pagination: {
              ...state.publicOrganizations?.pagination,
              exclusiveAgents: paginationInfo,
            },
          },
        };
      },
      false,
      "setPublicExclusiveAgents"
    );
  },
  setPublicInsuranceCompanies: (publicInsuranceCompanies, paginationInfo) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            suppliers: state.publicOrganizations?.suppliers,
            exclusiveAgents: state.publicOrganizations?.exclusiveAgents,
            insuranceBrokers: state.publicOrganizations?.insuranceBrokers,
            brokerageSocieties: state.publicOrganizations?.brokerageSocieties,
            insuranceCompanies: publicInsuranceCompanies,
            pagination: {
              ...state.publicOrganizations?.pagination,
              insuranceCompanies: paginationInfo,
            },
          },
        };
      },
      false,
      "setPublicInsuranceCompanies"
    );
  },
  setPublicBrokerageSocieties: (publicBrokerageSocieties, paginationInfo) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            suppliers: state.publicOrganizations?.suppliers,
            exclusiveAgents: state.publicOrganizations?.exclusiveAgents,
            insuranceBrokers: state.publicOrganizations?.insuranceBrokers,
            brokerageSocieties: publicBrokerageSocieties,
            insuranceCompanies: state.publicOrganizations?.insuranceCompanies,
            pagination: {
              ...state.publicOrganizations?.pagination,
              brokerageSocieties: paginationInfo,
            },
          },
        };
      },
      false,
      "setPublicBrokerageSocieties"
    );
  },
  setPublicInsuranceBrokers: (publicInsuranceBrokers, paginationInfo) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            suppliers: state.publicOrganizations?.suppliers,
            exclusiveAgents: state.publicOrganizations?.exclusiveAgents,
            insuranceBrokers: publicInsuranceBrokers,
            brokerageSocieties: state.publicOrganizations?.brokerageSocieties,
            insuranceCompanies: state.publicOrganizations?.insuranceCompanies,
            pagination: {
              ...state.publicOrganizations?.pagination,
              insuranceBrokers: paginationInfo,
            },
          },
        };
      },
      false,
      "setPublicInsuranceBrokers"
    );
  },
  resetPublicOrganizations: () => {
    return set(
      { ...initialPublicOrganizationsStoreState },
      false,
      "resetPublicOrganizationsStore"
    );
  },
});
