import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";
import { ORGANIZATION_CLIENT_FIELDS_FRAGMENT } from "./organization-fields";

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
    birthDate
    sex
    foundationYear
    recognitions
    clients {
      ...OrganizationClientFields
    }
    address {
      ...AddressFields
    }
  }

  ${ADDRESS_FIELDS_FRAGMENT}
  ${ORGANIZATION_CLIENT_FIELDS_FRAGMENT}
`;
