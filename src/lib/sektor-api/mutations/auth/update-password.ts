import { gql } from "@apollo/client";

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($input: UpdatePasswordInputType!) {
    updatePassword(input: $input)
  }
`;
