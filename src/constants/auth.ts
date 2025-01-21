export const USER_TYPES = {
  CUSTOMER: "customer", // Persona natural
  INSURANCE_BROKER: "insurance_broker", // corredor de seguros
  BROKERAGE_SOCIETY: "brokerage_society", // sociedad de corretaje
  EXCLUSIVE_AGENT: "exclusive_agent", // agente exclusivo
  SUPPLIER: "supplier", // proveedor
  INSURANCE_COMPANY: "insurance_company", // compañía de seguros
  INTERMEDIARY: "intermediary", // intermediario
} as const;

export const SERVICE_SUPPLIER_TYPES = {
  CLINIC: "clinic", // clínicas
  WORKSHOP: "workshop", // talleres
  MEDICAL_HOUSE: "medical_house", // casas médicas
  PRIMARY_CARE: "primary_care", // atención primaria
} as const;

export const USER_GROUPS = {
  ADMIN: "admin",
  MEMBER: "member", // miembro de la organización
  CUSTOMER: "customer", // cliente persona natural
} as const;

export const GENRES = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

export const ORGANIZATION_LINE_OF_BUSINESS = {
  LIFE: "Life",
  HEALTH: "Health",
  AUTO: "Auto",
  TRAVEL: "Travel",
  AVIATION: "Aviation",
  FINANCIAL: "Financial",
  PROPERTY: "Property",
} as const;
