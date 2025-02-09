import { gql } from "@apollo/client";
import { BROKERAGE_SOCIETY_FIELDS_FRAGMENT } from "../../fragments/brokerage-society-fields";

export const PUBLIC_BROKERAGE_SOCIETY_QUERY = gql`
  query getPublicBrokerageSocieties(
    $pagination: PaginationType
    $filter: BrokerageSocietyFilterType
  ) {
    publicBrokerageSocieties(pagination: $pagination, filter: $filter) {
      items {
        ...BrokerageSocietyFields
      }
      count
      pages
    }
  }

  ${BROKERAGE_SOCIETY_FIELDS_FRAGMENT}
`;

export const PUBLIC_BROKERAGE_SOCIETY_BY_ID_QUERY = gql`
  query getBrokerageSocietyById($id: String!) {
    publicBrokerageSocietyById(id: $id) {
      ...BrokerageSocietyFields
    }
  }

  ${BROKERAGE_SOCIETY_FIELDS_FRAGMENT}
`;
