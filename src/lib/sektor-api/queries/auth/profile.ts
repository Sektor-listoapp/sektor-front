import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  query profile {
    profile {
      id
      name
      email
      deletedAt
      verifiedAt
      group
    }
  }
`;
