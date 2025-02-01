import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";
import { ORGANIZATION_CLIENT_FIELDS_FRAGMENT } from "./organization-fields";

export const EXCLUSIVE_AGENT_FIELDS_FRAGMENT = gql`
  fragment ExclusiveAgentFields on ExclusiveAgentType {
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

  ${ORGANIZATION_CLIENT_FIELDS_FRAGMENT}
  ${ADDRESS_FIELDS_FRAGMENT}
`;
