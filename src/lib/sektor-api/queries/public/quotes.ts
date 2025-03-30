import { gql } from "@apollo/client";

export const QUOTES_QUERY = gql`
  query quotes(
    $pagination: PaginationType
    $filter: QuoteFilterType
    $organizationId: String
  ) {
    quotes(
      pagination: $pagination
      filter: $filter
      organizationId: $organizationId
    ) {
      items {
        id
        lineOfBusiness
        read
        rating
        createdAt
        updatedAt
        customer {
          id
          name
          phone
        }
        city {
          id
          name
        }
        organization {
          id
          name
          type
        }
      }
    }
  }
`;
