import { gql } from "@apollo/client";

export const DELETE_MODULE = gql`
  mutation deleteModule($id: ID!) {
    deleteModule(id: $id)
  }
`;


