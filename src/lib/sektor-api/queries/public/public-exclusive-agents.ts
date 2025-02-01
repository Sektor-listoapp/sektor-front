import { gql } from "@apollo/client";
import { EXCLUSIVE_AGENT_FIELDS_FRAGMENT } from "../../fragments";

export const PUBLIC_EXCLUSIVE_AGENTS_QUERY = gql`
  query getPublicExclusiveAgents(
    $pagination: PaginationType
    $filter: ExclusiveAgentFilterType
  ) {
    publicExclusiveAgents(pagination: $pagination, filter: $filter) {
      items {
        ...ExclusiveAgentFields
      }
      count
      pages
    }
  }

  ${EXCLUSIVE_AGENT_FIELDS_FRAGMENT}
`;
