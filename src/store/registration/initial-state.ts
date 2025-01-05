import { REGISTER_STEPS } from "@/constants/register";
import { RegistrationStoreState } from "./types";

export const initialRegistrationStoreState: RegistrationStoreState = {
  userType: null,
  currentStep: REGISTER_STEPS.UserTypes,
  nextStep: null,
  newUser: {
    email: null,
    name: null,
  },
};
