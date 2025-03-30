import { gql } from "@apollo/client";

export const QUOTE_CUSTOMER_FIELDS_FRAGMENT = gql`
  fragment QuoteCustomerFields on QuoteCustomerType {
    id
    name
    phone
    email
  }
`;

export const QUOTE_CITY_FIELDS_FRAGMENT = gql`
  fragment QuoteCityFields on QuoteCityType {
    id
    name
  }
`;
