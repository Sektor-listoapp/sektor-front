import { gql } from "@apollo/client";

export const PUBLIC_INSURANCE_BROKERS_QUERY = gql`
  query getPublicInsuranceBrokers {
    getPublicInsuranceBrokers {
      items {
        name
        id
        type
        logoUrl
        createdAt
        __typename
      }
      __typename
    }
  }
`;
