import { USER_TYPES } from "@/constants/shared";
import { InsuranceCompanySubtype } from "@/lib/sektor-api/__generated__/types";

const {
  INSURANCE_BROKER,
  EXCLUSIVE_AGENT,
  BROKERAGE_SOCIETY,
  INSURANCE_COMPANY,
  INSURANCE_COMPANY_COOPERATIVE,
  SUPPLIER,
} = USER_TYPES;

export const REGISTRATION_COMPANY_OPTIONS = [
  {
    userType: INSURANCE_BROKER,
    label: "Corredor de seguros",
    imagePath: "/images/entities-icons/corredor-de-seguros.svg",
  },
  {
    userType: EXCLUSIVE_AGENT,
    label: "Agente exclusivo",
    imagePath: "/images/entities-icons/agente-exclusivo.svg",
  },
  {
    userType: BROKERAGE_SOCIETY,
    label: "Sociedad de corretaje",
    imagePath: "/images/entities-icons/sociedad-de-corretaje.svg",
  },
  {
    userType: INSURANCE_COMPANY_COOPERATIVE,
    label: "Cooperativa/ Medicina prepagada",
    imagePath: "/images/cooperativa.png",
    insuranceCompanySubtype: InsuranceCompanySubtype.Cooperatives,
  },
  {
    userType: INSURANCE_COMPANY,
    label: "Compañía de seguros",
    imagePath: "/images/entities-icons/compania-de-seguros.svg",
    insuranceCompanySubtype: InsuranceCompanySubtype.Standard,
  },
  {
    userType: SUPPLIER,
    label: "Proveedores",
    imagePath: "/images/entities-icons/proovedores.svg",
  },
] as const;
