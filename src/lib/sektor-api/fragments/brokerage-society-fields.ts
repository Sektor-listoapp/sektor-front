import { gql } from "@apollo/client";
import {
  ORGANIZATION_CLIENT_FIELDS_FRAGMENT,
  ORGANIZATION_OFFICE_FIELDS_FRAGMENT,
  ORGANIZATION_TEAM_MEMBER_FIELDS_FRAGMENT,
} from "./organization-fields";
import { INSURANCE_COMPANY_FIELDS_FRAGMENT } from "./insurance-company-fields";

export const BROKERAGE_SOCIETY_CONTACT_FIELDS_FRAGMENT = gql`
  fragment BrokerageSocietyContactFields on BrokerageSocietyContactType {
    name
    position
  }
`;

export const BROKERAGE_SOCIETY_FIELDS_FRAGMENT = gql`
  fragment BrokerageSocietyFields on BrokerageSocietyType {
    id
    name
    group
    logoUrl
    type
    isActive
    lineOfBusiness
    coverageStates
    modality
    phone
    rif
    license
    recognitions
    allies
    offices {
      ...OrganizationOfficeFields
    }
    contact {
      ...BrokerageSocietyContactFields
    }
    workTeam {
      ...OrganizationTeamMemberFields
    }
    insuranceCompanies {
      ...InsuranceCompanyFields
    }
    clients {
      ...OrganizationClientFields
    }
  }

  ${ORGANIZATION_OFFICE_FIELDS_FRAGMENT}
  ${BROKERAGE_SOCIETY_CONTACT_FIELDS_FRAGMENT}
  ${ORGANIZATION_TEAM_MEMBER_FIELDS_FRAGMENT}
  ${INSURANCE_COMPANY_FIELDS_FRAGMENT}
  ${ORGANIZATION_CLIENT_FIELDS_FRAGMENT}
`;
