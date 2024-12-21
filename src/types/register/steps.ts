import { REGISTER_STEPS } from "../../constants/register/steps";
import { UserType } from "../shared";

export type RegisterSteps = typeof REGISTER_STEPS;

export type RegisterStep = {
  index: number;
  component: string;
  nextStep: string | Record<string, string>;
};
