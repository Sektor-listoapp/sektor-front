import { gql } from "@apollo/client";

export const REQUEST_OTHER_QUOTE = gql`
  mutation requestOtherQuote($input: OtherQuoteInputType!) {
    requestOtherQuote(input: $input) {
      id
      customer {
        id
        name
      }
      city {
        id
        name
      }
      lineOfBusiness
      comments
    }
  }
`;
