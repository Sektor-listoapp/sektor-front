import { gql } from "@apollo/client";

export const CITY_FIELDS_FRAGMENT = gql`
  fragment CityFields on CityType {
    id
    name
  }
`;

export const STATE_FIELDS_FRAGMENT = gql`
  fragment StateFields on StateType {
    id
    name
    cities {
      ...CityFields
    }
  }

  ${CITY_FIELDS_FRAGMENT}
`;

export const COUNTRY_FIELDS_FRAGMENT = gql`
  fragment CountryFields on CountryType {
    id
    code
    name
    states {
      ...StateFields
    }
  }

  ${STATE_FIELDS_FRAGMENT}
`;

export const ADDRESS_FIELDS_FRAGMENT = gql`
  fragment AddressFields on AddressType {
    street
    country {
      ...CountryFields
    }
    state {
      ...StateFields
    }
    city {
      ...CityFields
    }
  }

  ${COUNTRY_FIELDS_FRAGMENT}
  ${STATE_FIELDS_FRAGMENT}
  ${CITY_FIELDS_FRAGMENT}
`;
