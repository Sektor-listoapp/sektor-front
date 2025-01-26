import {
  GENRES,
  ORGANIZATION_LINE_OF_BUSINESS,
  ORGANIZATION_MODALITY,
} from "../../constants/shared";
import { UserType } from "../shared";
import { SERVICE_SUPPLIER_TYPES } from "../../constants/shared";

export interface OrganizationAddress {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface CommonPublicOrganizationFields {
  id: string;
  name: string;
  type: UserType;
  logoUrl: string;
  createdAt: string;
  address: OrganizationAddress;
  modality: keyof typeof ORGANIZATION_MODALITY;
  lineOfBusiness: keyof typeof ORGANIZATION_LINE_OF_BUSINESS;
}

export interface PublicSupplier extends CommonPublicOrganizationFields {
  serviceType: keyof typeof SERVICE_SUPPLIER_TYPES;
}

export interface PublicInsuranceCompany extends CommonPublicOrganizationFields {
  contact: string;
}

export interface PublicBrokerageSociety extends CommonPublicOrganizationFields {
  rif: string;
  license: string;
}

export interface PublicInsuranceBroker extends CommonPublicOrganizationFields {
  license: string;
  birthdate: string;
  startDate: string;
  sex: keyof typeof GENRES;
  serviceType: keyof typeof SERVICE_SUPPLIER_TYPES;
}

export interface PublicExclusiveAgent extends CommonPublicOrganizationFields {
  license: string;
  birthdate: string;
  startDate: string;
  sex: keyof typeof GENRES;
  serviceType: keyof typeof SERVICE_SUPPLIER_TYPES;
}

export interface PublicOrganizations {
  suppliers?: PublicSupplier[] | null;
  exclusiveAgents?: PublicExclusiveAgent[] | null;
  insuranceBrokers?: PublicInsuranceBroker[] | null;
  brokerageSocieties?: PublicBrokerageSociety[] | null;
  insuranceCompanies?: PublicInsuranceCompany[] | null;
}
