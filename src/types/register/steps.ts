import { REGISTER_STEPS } from "../../constants/register/steps";
import { REGISTER_COMPONENTS_MAP } from "../../constants/register/components";

export type RegisterSteps = typeof REGISTER_STEPS;

export type RegisterStep = {
  index: number;
  component: keyof typeof REGISTER_COMPONENTS_MAP;
  nextStep: Record<string, keyof typeof REGISTER_COMPONENTS_MAP>;
};
