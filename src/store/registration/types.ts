/* eslint-disable @typescript-eslint/no-explicit-any */
import { InsuranceCompanySubtype } from "@/lib/sektor-api/__generated__/types";
import { RegisterStep } from "@/types/register";
import { REGISTER_STEPS } from "../../constants/register/steps";

type NewUser = {
  email: string | null;
  name: string | null;
};

export interface RegistrationStoreState {
  userType: string | any;
  insuranceCompanySubtype: InsuranceCompanySubtype | null;
  currentStep: (typeof REGISTER_STEPS)[keyof typeof REGISTER_STEPS];
  nextStep: RegisterStep | null;
  newUser: NewUser;
}

export interface RegistrationStoreActions {
  setUserType: (userType: string | any) => void;
  setInsuranceCompanySubtype: (
    insuranceCompanySubtype: InsuranceCompanySubtype | null
  ) => void;
  setCurrentRegistrationStep: (currentStep: RegisterStep) => void;
  setNewUser: (newUser: NewUser) => void;
  resetRegistrationStore: () => void;
}

export type RegistrationStore = RegistrationStoreState &
  RegistrationStoreActions;

export interface RegistrationStoreSetter {
  (
    partial:
      | RegistrationStore
      | Partial<RegistrationStore>
      | ((
          state: RegistrationStore
        ) => RegistrationStore | Partial<RegistrationStore>),
    replace?: false | undefined,
    action?: string | undefined
  ): void;
  (
    state:
      | RegistrationStore
      | ((state: RegistrationStore) => RegistrationStore),
    replace: true,
    action?: string | undefined
  ): void;
}

export type RegistrationStoreGetter = () => RegistrationStore;
