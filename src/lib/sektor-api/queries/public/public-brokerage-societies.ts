import { gql } from "@apollo/client";

export const PUBLIC_BROKERAGE_SOCIETY_QUERY = gql`
  query getPublicBrokerageSocieties(
    $pagination: PaginationType
    $filter: BrokerageSocietyFilterType
  ) {
    publicBrokerageSocieties(pagination: $pagination, filter: $filter) {
      items {
        id
        name
        type
        logoUrl
        createdAt
        lineOfBusiness
        modality
        rif
        license
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
