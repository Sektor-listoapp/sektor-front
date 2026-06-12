import { gql } from "@apollo/client";
import { CUSTOMER_FIELDS_FRAGMENT } from "../../fragments";

export const SEARCH_CUSTOMERS = gql`
  query searchCustomers(
    $pagination: PaginationType!
    $filter: SearchCustomerFilterType
  ) {
    searchCustomers(pagination: $pagination, filter: $filter) {
      items {
        ...CustomerFields
      }
    }
  }
  ${CUSTOMER_FIELDS_FRAGMENT}
`;
