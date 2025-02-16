import { gql } from "@apollo/client";

export const REQUEST_HEALTH_QUOTE = gql`
  mutation requestHealthQuote($input: HealthQuoteInputType!) {
    requestHealthQuote(input: $input) {
      id
      customer {
        id
        name
      }
      city {
        id
        name
      }
      organization {
        id
        name
        type
      }
      upToInsuranceAmount
      dateOfBirth
      maternity
      dental
      vision
      funeral
      primaryCare
      lineOfBusiness
      comments
    }
  }
`;
