import { gql } from "@apollo/client";
import { INSURANCE_BROKER_FIELDS_FRAGMENT } from "../../fragments";

export const PUBLIC_INSURANCE_BROKERS_QUERY = gql`
  query getPublicInsuranceBrokers(
    $pagination: PaginationType
    $filter: InsuranceBrokerFilterType
  ) {
    publicInsuranceBrokers(pagination: $pagination, filter: $filter) {
      items {
        ...InsuranceBrokerFields
      }
      count
      pages
    }
  }

  ${INSURANCE_BROKER_FIELDS_FRAGMENT}
`;

export const PUBLIC_INSURANCE_BROKER_BY_ID_QUERY = gql`
  query getInsuranceBrokerById($id: String!) {
    publicInsuranceBrokerById(id: $id) {
      ...InsuranceBrokerFields
    }
  }

  ${INSURANCE_BROKER_FIELDS_FRAGMENT}
`;
