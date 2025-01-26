import { gql } from "@apollo/client";

export const PUBLIC_INSURANCE_BROKER_FIELDS_FRAGMENT = gql`
  fragment PublicInsuranceBrokerFields on InsuranceBrokerType {
    id
    name
    type
    logoUrl
    createdAt
    lineOfBusiness
    modality
    address {
      street
      city
      state
      country
    }
  }
`;

export const PUBLIC_INSURANCE_BROKERS_QUERY = gql`
  query getPublicInsuranceBrokers(
    $pagination: PaginationType
    $filter: InsuranceBrokerFilterType
  ) {
    publicInsuranceBrokers(pagination: $pagination, filter: $filter) {
      items {
        ...PublicInsuranceBrokerFields
      }
      count
      pages
    }

    ${PUBLIC_INSURANCE_BROKER_FIELDS_FRAGMENT}
    }
`;
