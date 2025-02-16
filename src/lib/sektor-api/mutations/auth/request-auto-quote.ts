import { gql } from "@apollo/client";

export const REQUEST_AUTO_QUOTE = gql`
  mutation requestAutoQuote($input: AutoQuoteInputType!) {
    requestAutoQuote(input: $input) {
      id
      city {
        id
        name
      }
      lineOfBusiness
      comments
      coverage
      make
      model
      year
      version
    }
  }
`;
