import { gql } from "@apollo/client";

export const PUBLIC_EXCLUSIVE_AGENT_FIELDS_FRAGMENT = gql`
  fragment PublicExclusiveAgentFields on ExclusiveAgentType {
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

    ${PUBLIC_EXCLUSIVE_AGENT_FIELDS_FRAGMENT}
  }
`;
