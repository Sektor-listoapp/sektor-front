import { gql } from "@apollo/client";
import { COUNTRY_FIELDS_FRAGMENT } from "../../fragments";

export const COUNTRY_BY_CODE_QUERY = gql`
  query getCountryByCode($code: String!) {
    getCountryByCode(code: $code) {
      ...CountryFields
    }
  }

  ${COUNTRY_FIELDS_FRAGMENT}
`;
