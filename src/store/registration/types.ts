import { RegisterStep } from "@/types/register";
import { UserType } from "@/types/shared";

export interface RegistrationStoreState {
  userType: UserType;
  currentStep: RegisterStep;
  nextStep: RegisterStep | null;
}

export interface RegistrationStoreActions {
  setUserType: (userType: UserType) => void;
  setCurrentRegistrationStep: (currentStep: RegisterStep) => void;
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
