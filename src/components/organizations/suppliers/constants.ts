import { SERVICE_SUPPLIER_TYPES } from "@/constants/shared";

const { CLINIC, MEDICAL_HOUSE, PRIMARY_CARE, WORKSHOP } =
  SERVICE_SUPPLIER_TYPES;

export const SUPPLIER_SERVICE_TYPE_LABEL = {
  [CLINIC]: "Clínica",
  [MEDICAL_HOUSE]: "Casa médica",
  [PRIMARY_CARE]: "Atención primaria",
  [WORKSHOP]: "Taller",
} as const;
