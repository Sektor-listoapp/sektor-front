import { OrganizationAddress } from "../shared";

export interface PublicInsuranceCompany {
  id: string;
  name: string;
  type: string;
  logoUrl: string;
  createdAt: string;
  lineOfBusiness: string;
  modality: string;
  address: OrganizationAddress;
}
