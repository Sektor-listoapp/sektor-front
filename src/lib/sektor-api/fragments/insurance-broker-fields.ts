import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";
import { ORGANIZATION_CLIENT_FIELDS_FRAGMENT } from "./organization-fields";

export const INSURANCE_BROKER_FIELDS_FRAGMENT = gql`
  fragment InsuranceBrokerFields on InsuranceBrokerType {
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
    license
    birthDate
    sex
    allies
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
