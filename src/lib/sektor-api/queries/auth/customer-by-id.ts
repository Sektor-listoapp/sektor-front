import { gql } from "@apollo/client";
import { CUSTOMER_FIELDS_FRAGMENT } from "../../fragments";

export const CUSTOMER_BY_ID_QUERY = gql`
  query customerById($id: String!) {
    customerById(id: $id) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FIELDS_FRAGMENT}
`;
