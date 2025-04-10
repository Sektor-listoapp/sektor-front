import { gql } from "@apollo/client";

export const PUBLIC_ORGANIZATION_FIELDS_FRAGMENT = gql`
  fragment PublicOrganizationFields on PublicOrganizationType {
    id
    name
    logoUrl
    type
    isActive
    lineOfBusiness
    coverageStates
    modality
  }
`;
