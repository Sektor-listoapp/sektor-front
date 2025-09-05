import { gql } from "@apollo/client";

export const STATES_QUERY = gql`
  query getCountryByCode($code: String!) {
    getCountryByCode(code: $code) {
      states {
        id
        name
      }
    }
  }
`;

