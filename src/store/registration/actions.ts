import { initialRegistrationStoreState } from "./initial-state";
import { RegistrationStoreActions, RegistrationStoreSetter } from "./types";

export const registrationStoreActions = (
  set: RegistrationStoreSetter
): RegistrationStoreActions => ({
  resetRegistrationStore: () => {
    return set(
      { ...initialRegistrationStoreState },
      false,
      "resetRegistrationStore"
    );
  },
  setUserType: (userType) => {
    return set({ userType }, false, "setUserId");
  },
  setCurrentRegistrationStep: (currentStep) => {
    return set({ currentStep }, false, "setCurrentRegistrationStep");
  },
});
