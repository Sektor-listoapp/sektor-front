import { gql } from "@apollo/client";

export const DELETE_ORGANIZATION = gql`
  mutation deleteOrganization($id: String!) {
    deleteOrganization(id: $id)
  }
`;
