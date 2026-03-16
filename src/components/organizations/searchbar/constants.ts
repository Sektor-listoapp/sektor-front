import dynamic from "next/dynamic";
import { USER_TYPES } from "@/constants/shared";
import {
  faBuilding,
  faLandmark,
  faPersonBurst,
  faTruckFieldUn,
  faUserTie,
  faHospitalUser,
  faHeartbeat,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";

const {
  INSURANCE_BROKER,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  SUPPLIER,
  INSURANCE_COMPANY,
  INSURANCE_COMPANY_COOPERATIVE,
  INSURANCE_COMPANY_INSURTECH,
  INSURANCE_COMPANY_PREPAID_MEDICINE,
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
    id: INSURANCE_COMPANY_COOPERATIVE,
    name: "Cooperativas",
    icon: faHospitalUser,
    imagePath: "/images/cooperativa.png",
    type: INSURANCE_COMPANY_COOPERATIVE,
  },
  {
    id: INSURANCE_COMPANY_PREPAID_MEDICINE,
    name: "Medicina Prepagada",
    icon: faHeartbeat,
    imagePath: "/images/prepagada.png",
    type: INSURANCE_COMPANY_PREPAID_MEDICINE,
  },
  {
    id: INSURANCE_COMPANY_INSURTECH,
    name: "Insurtech",
    icon: faLaptopCode,
    imagePath: "/images/insurtech.png",
    type: INSURANCE_COMPANY_INSURTECH,
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
