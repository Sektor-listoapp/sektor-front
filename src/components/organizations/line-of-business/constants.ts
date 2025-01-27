import { ORGANIZATION_LINE_OF_BUSINESS } from "@/constants/shared";
import {
  faCar,
  faHeart,
  faHouseMedical,
  faMoneyBill1Wave,
  faPassport,
  faPeopleRoof,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";

const { AUTO, AVIATION, FINANCIAL, HEALTH, LIFE, PROPERTY, TRAVEL } =
  ORGANIZATION_LINE_OF_BUSINESS;

export const LINE_OF_BUSINESS_LABEL = {
  [AUTO]: "Automoviles",
  [AVIATION]: "Aviación",
  [FINANCIAL]: "Finanzas",
  [HEALTH]: "Salud",
  [LIFE]: "Vida",
  [PROPERTY]: "Patrimoniales",
  [TRAVEL]: "Viajes",
} as const;

export const LINE_OF_BUSINESS_ICON = {
  [AUTO]: faCar,
  [AVIATION]: faPlane,
  [FINANCIAL]: faMoneyBill1Wave,
  [HEALTH]: faHouseMedical,
  [LIFE]: faHeart,
  [PROPERTY]: faPeopleRoof,
  [TRAVEL]: faPassport,
} as const;
