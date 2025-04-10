import { ServiceSupplierTypes } from "@/lib/sektor-api/__generated__/types";

const { Clinic, MedicalHouse, PrimaryCare, Workshop } = ServiceSupplierTypes;

export const SUPPLIER_SERVICE_TYPE_LABEL = {
  [Clinic]: "Clínica",
  [MedicalHouse]: "Casa médica",
  [PrimaryCare]: "Atención primaria",
  [Workshop]: "Taller",
} as const;
