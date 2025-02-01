import { gql } from "@apollo/client";
import { PUBLIC_ORGANIZATION_FIELDS_FRAGMENT } from "../../fragments";

export const PUBLIC_ORGANIZATIONS_QUERY = gql`
  query getPublicOrganizations(
    $pagination: PaginationType!
    $filter: PublicOrganizationFilterType!
  ) {
    publicOrganizations(pagination: $pagination, filter: $filter) {
      items {
        ...PublicOrganizationFields
      }
      count
      pages
    }
  }

  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
`;
