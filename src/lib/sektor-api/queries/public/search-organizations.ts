import { gql } from "@apollo/client";
import { ORGANIZATION_FIELDS_FRAGMENT } from "../../fragments";

export const SEARCH_ORGANIZATIONS = gql`
  query searchOrganizations(
    $pagination: PaginationType!
    $filter: SearchOrganizationFilterType
  ) {
    searchOrganizations(pagination: $pagination, filter: $filter) {
      items {
        ...OrganizationFields
      }
    }
  }
  ${ORGANIZATION_FIELDS_FRAGMENT}
`;
