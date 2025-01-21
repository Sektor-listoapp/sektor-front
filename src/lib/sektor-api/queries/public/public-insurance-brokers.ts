import { gql } from "@apollo/client";

export const PUBLIC_INSURANCE_BROKERS_QUERY = gql`
  query getPublicInsuranceBrokers(
    $pagination: PaginationType
    $filter: InsuranceBrokerFilterType
  ) {
    publicInsuranceBrokers(pagination: $pagination, filter: $filter) {
      items {
        id
        name
        type
        logoUrl
        createdAt
        lineOfBusiness
        modality
        license
        address {
          street
          city
          state
          country
        }
      }
      count
      pages
    }
  }
`;
