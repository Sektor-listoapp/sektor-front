import { gql } from "@apollo/client";

export const COUNTRY_BY_CODE_QUERY = gql`
  query getCountryByCode($code: String!) {
    getCountryByCode(code: $code) {
      __typename
      id
      code
      name
      states {
        id
        name
        cities {
          id
          name
          __typename
        }
        __typename
      }
    }
  }
`;
