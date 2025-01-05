const { InsuranceCompanyForm, DataSentToConfirm } = REGISTER_STEPS;
import { REGISTER_STEPS } from "@/constants/register";

export const COMMON_REGISTRATION_STEPS = [
  {
    label: "Tipo de usuario",
    index: 0,
  },
  {
    label: "Ingresa los datos",
    index: 1,
  },
  {
    label: "Link enviado",
    index: 2,
  },
  {
    label: "Cuenta verificada",
    index: 3,
  },
];

export const STEPS_FOR_REGISTRATION_CONFIRMATION = [
  {
    label: "Tipo de usuario",
    index: 0,
  },
  {
    label: "Ingresa los datos",
    index: 1,
  },
  {
    label: "Datos enviados",
    index: 2,
  },
];

export const COMPONENTS_TO_SHOW_STEPS_FOR_REGISTRATION_CONFIRMATION = [
  InsuranceCompanyForm.component,
  DataSentToConfirm.component,
];
