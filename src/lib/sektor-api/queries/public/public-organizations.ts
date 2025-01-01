import { gql } from "@apollo/client";

export const PUBLIC_ORGANIZATIONS_QUERY = gql`
  query getPublicOrganizations($type: OrganizationTypes!) {
    getPublicOrganizations(type: $type) {
      items {
        name
        id
        type
        logoUrl
        createdAt
        __typename
      }
      __typename
    }
  }
`;
