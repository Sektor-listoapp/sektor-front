import { USER_TYPES } from "@/constants/shared";
import {
  faBuilding,
  faLandmark,
  faPersonBurst,
  faTruckFieldUn,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

const {
  INSURANCE_BROKER,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  SUPPLIER,
  INSURANCE_COMPANY,
} = USER_TYPES;

export const ORGANIZATION_TYPE_OPTIONS = [
  {
    id: INSURANCE_BROKER,
    name: "Corredores de Seguros",
    icon: faBuilding,
    type: INSURANCE_BROKER,
  },
  {
    id: BROKERAGE_SOCIETY,
    name: "Sociedades de Corretaje",
    icon: faUserTie,
    type: BROKERAGE_SOCIETY,
  },
  {
    id: EXCLUSIVE_AGENT,
    name: "Agentes Exclusivos",
    icon: faPersonBurst,
    type: EXCLUSIVE_AGENT,
  },
  {
    id: INSURANCE_COMPANY,
    name: "Compañías de Seguros",
    icon: faLandmark,
    type: INSURANCE_COMPANY,
  },
  {
    id: SUPPLIER,
    name: "Proveedores",
    icon: faTruckFieldUn,
    type: SUPPLIER,
  },
] as const;

export const ORGANIZATION_FILTER_COMPONENTS = {
  [INSURANCE_BROKER]: dynamic(() => import("./default-filters")),
  [BROKERAGE_SOCIETY]: dynamic(() => import("./brokerage-society-filters")),
  [EXCLUSIVE_AGENT]: dynamic(() => import("./default-filters")),
  [INSURANCE_COMPANY]: dynamic(() => import("./insurance-company-filters")),
  [SUPPLIER]: dynamic(() => import("./supplier-filters")),
} as const;
