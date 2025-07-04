import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";
import {
  ORGANIZATION_CLIENT_FIELDS_FRAGMENT,
  ORGANIZATION_RECOGNITION_FIELDS_FRAGMENT,
  ORGANIZATION_STUDY_FIELDS_FRAGMENT,
} from "./organization-fields";
import { PUBLIC_ORGANIZATION_FIELDS_FRAGMENT } from "./public-organization-fields";
import { INSURANCE_COMPANY_FIELDS_FRAGMENT } from "./insurance-company-fields";

export const EXCLUSIVE_AGENT_FIELDS_FRAGMENT = gql`
  fragment ExclusiveAgentFields on ExclusiveAgentType {
    id
    name
    logoUrl
    type
    isActive
    lineOfBusiness
    coverageStates
    modality
    license
    birthDate
    plan
    sex
    foundationYear
    identification
    license
    phone
    email
    insuranceCompanies {
      ...InsuranceCompanyFields
    }
    recognitions {
      ...OrganizationRecognitionFields
    }
    allies {
      ...PublicOrganizationFields
    }
    clients {
      ...OrganizationClientFields
    }
    address {
      ...AddressFields
    }
    studies {
      ...studiesFields
    }
    socialMediaLinks {
      ...SocialMediaLinkFields
    }
    offices {
      ...OrganizationOfficeFields
    }
  }

  ${INSURANCE_COMPANY_FIELDS_FRAGMENT}
  ${ORGANIZATION_RECOGNITION_FIELDS_FRAGMENT}
  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${ORGANIZATION_CLIENT_FIELDS_FRAGMENT}
  ${ADDRESS_FIELDS_FRAGMENT}
  ${ORGANIZATION_STUDY_FIELDS_FRAGMENT}
`;
