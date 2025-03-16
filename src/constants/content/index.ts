import { OrganizationTypes } from "@/lib/sektor-api/__generated__/types";

const {
  Supplier,
  ExclusiveAgent,
  InsuranceBroker,
  InsuranceCompany,
  BrokerageSociety,
} = OrganizationTypes;

export const ORGANIZATION_TYPE_LABEL = {
  SINGULAR: {
    [Supplier]: "Proveedor",
    [ExclusiveAgent]: "Agente Exclusivo",
    [InsuranceBroker]: "Corredor de Seguros",
    [InsuranceCompany]: "Compañía de Seguros",
    [BrokerageSociety]: "Sociedad de Corretaje",
  },
  PLURAL: {
    [Supplier]: "Proveedores",
    [ExclusiveAgent]: "Agentes Exclusivos",
    [InsuranceBroker]: "Corredores de Seguros",
    [InsuranceCompany]: "Compañías de Seguros",
    [BrokerageSociety]: "Sociedades de Corretaje",
  },
};
