import { gql } from "@apollo/client";

export const PUBLIC_EXCLUSIVE_AGENTS_QUERY = gql`
  query getPublicExclusiveAgents(
    $pagination: PaginationType
    $filter: ExclusiveAgentFilterType
  ) {
    publicExclusiveAgents(pagination: $pagination, filter: $filter) {
      items {
        id
        name
        type
        logoUrl
        createdAt
        lineOfBusiness
        modality
        license
        birthDate
        sex
        startDate
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
