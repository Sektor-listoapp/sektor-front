import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($input: LoginInputType!) {
    login(input: $input) {
      token
      __typename
      user {
        id
        name
        email
        deletedAt
        verifiedAt
        group
      }
    }
  }
`;
