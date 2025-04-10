import { gql } from "@apollo/client";
import { ORGANIZATION_FIELDS_FRAGMENT } from "../../fragments";

export const ORGANIZATION_BY_ID_QUERY = gql`
  query getOrganizationById($id: String!) {
    organizationById(id: $id) {
      ...OrganizationFields
    }
  }

  ${ORGANIZATION_FIELDS_FRAGMENT}
`;
