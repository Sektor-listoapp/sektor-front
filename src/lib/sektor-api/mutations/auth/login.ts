import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($input: LoginInputType!) {
    login(input: $input) {
      token
      refreshToken
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
