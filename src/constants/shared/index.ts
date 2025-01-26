export const USER_TYPES = {
  CUSTOMER: "Customer", // Persona natural
  INTERMEDIARY: "Intermediary", // intermediario
  SUPPLIER: "Supplier", // proveedor
  INSURANCE_BROKER: "InsuranceBroker", // corredor de seguros
  BROKERAGE_SOCIETY: "BrokerageSociety", // sociedad de corretaje
  EXCLUSIVE_AGENT: "ExclusiveAgent", // agente exclusivo
  INSURANCE_COMPANY: "InsuranceCompany", // compañía de seguros
} as const;

export const SERVICE_SUPPLIER_TYPES = {
  CLINIC: "Clinic", // clínicas
  WORKSHOP: "Workshop", // talleres
  MEDICAL_HOUSE: "MedicalHouse", // casas médicas
  PRIMARY_CARE: "PrimaryCare", // atención primaria
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

export const ORGANIZATION_MODALITY = {
  ONLINE: "Online",
  PHYSICAL: "Physical",
  HYBRID: "Hybrid",
} as const;
