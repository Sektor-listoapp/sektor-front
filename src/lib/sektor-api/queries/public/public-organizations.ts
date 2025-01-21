import { gql } from "@apollo/client";

export const PUBLIC_ORGANIZATIONS_QUERY = gql`
  query getPublicOrganizations(
    $pagination: PaginationType!
    $filter: PublicOrganizationFilterType!
  ) {
    publicOrganizations(pagination: $pagination, filter: $filter) {
      items {
        id
        name
        type
        logoUrl
        createdAt
        lineOfBusiness
        modality
        address {
          street
          city
          state
          country
        }
      }
      count
      pages
    }
  }
`;
