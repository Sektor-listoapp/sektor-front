import { initialPublicOrganizationsStoreState } from "./initial-state";
import {
  PublicOrganizationsStoreActions,
  PublicOrganizationsStoreSetter,
} from "./types";

export const publicRegistrationsStoreActions = (
  set: PublicOrganizationsStoreSetter
): PublicOrganizationsStoreActions => ({
  setPublicOrganizations: (publicOrganizations) => {
    set({ publicOrganizations }, false, "setPublicOrganizations");
  },
  setPublicSuppliers: (publicSuppliers) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            ...state.publicOrganizations,
            suppliers: publicSuppliers,
          },
        };
      },
      false,
      "setPublicSuppliers"
    );
  },
  setPublicExclusiveAgents: (publicExclusiveAgents) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            ...state.publicOrganizations,
            exclusiveAgents: publicExclusiveAgents,
          },
        };
      },
      false,
      "setPublicExclusiveAgents"
    );
  },
  setPublicInsuranceCompanies: (publicInsuranceCompanies) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            ...state.publicOrganizations,
            insuranceCompanies: publicInsuranceCompanies,
          },
        };
      },
      false,
      "setPublicInsuranceCompanies"
    );
  },
  setPublicBrokerageSocieties: (publicBrokerageSocieties) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            ...state.publicOrganizations,
            brokerageSocieties: publicBrokerageSocieties,
          },
        };
      },
      false,
      "setPublicBrokerageSocieties"
    );
  },
  setPublicInsuranceBrokers: (publicInsuranceBrokers) => {
    return set(
      (state) => {
        return {
          ...state,
          publicOrganizations: {
            ...state.publicOrganizations,
            insuranceBrokers: publicInsuranceBrokers,
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
