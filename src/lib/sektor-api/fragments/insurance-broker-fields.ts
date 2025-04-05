import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";
import {
  ORGANIZATION_CLIENT_FIELDS_FRAGMENT,
  ORGANIZATION_RECOGNITION_FIELDS_FRAGMENT,
  ORGANIZATION_STUDY_FIELDS_FRAGMENT,
} from "./organization-fields";
import { PUBLIC_ORGANIZATION_FIELDS_FRAGMENT } from "./public-organization-fields";
import { INSURANCE_COMPANY_FIELDS_FRAGMENT } from "./insurance-company-fields";

export const INSURANCE_BROKER_FIELDS_FRAGMENT = gql`
  fragment InsuranceBrokerFields on InsuranceBrokerType {
    id
    name
    logoUrl
    type
    isActive
    lineOfBusiness
    coverageStates
    modality
    license
    plan
    birthDate
    sex
    identification
    license
    phone
    email
    insuranceCompanies {
      ...InsuranceCompanyFields
    }
    foundationYear
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
  }

  ${INSURANCE_COMPANY_FIELDS_FRAGMENT}
  ${ORGANIZATION_RECOGNITION_FIELDS_FRAGMENT}
  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${ADDRESS_FIELDS_FRAGMENT}
  ${ORGANIZATION_CLIENT_FIELDS_FRAGMENT}
  ${ORGANIZATION_STUDY_FIELDS_FRAGMENT}
`;
