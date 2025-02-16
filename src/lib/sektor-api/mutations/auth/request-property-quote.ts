import { gql } from "@apollo/client";

export const REQUEST_PROPERTY_QUOTE = gql`
  mutation requestPropertyQuote($input: PropertyQuoteInputType!) {
    requestPropertyQuote(input: $input) {
      id
      customer {
        id
        name
      }
      city {
        id
        name
      }
      industryAndCommerce
      residentialComplex
      lineOfBusiness
      comments
    }
  }
`;
