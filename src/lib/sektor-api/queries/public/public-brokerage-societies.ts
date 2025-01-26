import { gql } from "@apollo/client";

export const PUBLIC_BROKERAGE_SOCIETY_FIELDS_FRAGMENT = gql`
  fragment PublicBrokerageSocietyFields on BrokerageSocietyType {
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
`;

export const PUBLIC_BROKERAGE_SOCIETY_QUERY = gql`
  query getPublicBrokerageSocieties(
    $pagination: PaginationType
    $filter: BrokerageSocietyFilterType
  ) {
    publicBrokerageSocieties(pagination: $pagination, filter: $filter) {
      items {
        ...PublicBrokerageSocietyFields
      }
      count
      pages
    }

    ${PUBLIC_BROKERAGE_SOCIETY_FIELDS_FRAGMENT}
  }
`;
