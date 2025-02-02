import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";
import { ORGANIZATION_CLIENT_FIELDS_FRAGMENT } from "./organization-fields";
import { PUBLIC_ORGANIZATION_FIELDS_FRAGMENT } from "./public-organization-fields";

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
    sex
    foundationYear
    recognitions
    allies {
      ...PublicOrganizationFields
    }
    clients {
      ...OrganizationClientFields
    }
    address {
      ...AddressFields
    }
  }

  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${ORGANIZATION_CLIENT_FIELDS_FRAGMENT}
  ${ADDRESS_FIELDS_FRAGMENT}
`;
