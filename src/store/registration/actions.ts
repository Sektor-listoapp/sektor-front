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
    return set({ userType }, false, "setUserType");
  },
  setCurrentRegistrationStep: (currentStep) => {
    return set({ currentStep }, false, "setCurrentRegistrationStep");
  },
  setNewUser: (newUser) => {
    return set({ newUser }, false, "setNewUser");
  },
});
