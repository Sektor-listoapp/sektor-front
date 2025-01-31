import {
  GENRES,
  ORGANIZATION_LINE_OF_BUSINESS,
  SERVICE_SUPPLIER_TYPES,
} from "../shared";

const { MALE, FEMALE } = GENRES;
const { CLINIC, MEDICAL_HOUSE, PRIMARY_CARE, WORKSHOP } =
  SERVICE_SUPPLIER_TYPES;
const { AUTO, AVIATION, FINANCIAL, HEALTH, LIFE, PROPERTY, TRAVEL } =
  ORGANIZATION_LINE_OF_BUSINESS;

export const LICENSE_TYPE_OPTIONS = [
  { label: "CAA -", value: "CAA-" },
  { label: "AAA -", value: "AAA-" },
];

export const PHONE_CODE_OPTIONS = [
  { label: "+1 Usa", value: "+1" },
  { label: "+34 Esp", value: "+34" },
  { label: "+591 Bol", value: "+591" },
  { label: "+54 BR", value: "+54" },
  { label: "+58 Vzla", value: "+58" },
];

export const DEFAULT_PHONE_CODE = "+58";

export const SELECT_GENRE_OPTIONS = [
  {
    label: "Género",
    value: "",
    disabled: true,
    hidden: true,
  },
  { label: "Femenino", value: FEMALE },
  { label: "Masculino", value: MALE },
];

export const SELECT_LINE_OF_BUSINESS_OPTIONS = [
  {
    label: "Ramos",
    value: "",
    disabled: true,
    hidden: true,
  },
  { label: "Vida", value: LIFE },
  { label: "Salud", value: HEALTH },
  { label: "Viaje", value: TRAVEL },
  { label: "Automóvil", value: AUTO },
  { label: "Aviación", value: AVIATION },
  { label: "Finanzas", value: FINANCIAL },
  { label: "Patrimoniales", value: PROPERTY },
];

export const SELECT_SUPPLIER_SERVICE_OPTIONS = [
  {
    label: "Tipo de proveedor",
    value: "",
    disabled: true,
    hidden: true,
  },
  { label: "Clínicas", value: CLINIC },
  { label: "Talleres", value: WORKSHOP },
  { label: "Casa medica", value: MEDICAL_HOUSE },
  { label: "Atención medica primaria", value: PRIMARY_CARE },
];
