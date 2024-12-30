import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  query profile {
    profile {
      id
      name
      verifiedAt
      email
      companies
      group
    }
  }
`;
