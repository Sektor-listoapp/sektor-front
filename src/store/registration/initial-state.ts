import { REGISTER_STEPS } from "@/constants/register";
import { RegistrationStoreState } from "./types";

export const initialRegistrationStoreState: RegistrationStoreState = {
  userType: null,
  insuranceCompanySubtype: null,
  currentStep: REGISTER_STEPS.CompanyTypes,
  nextStep: null,
  newUser: {
    email: null,
    name: null,
  },
};
