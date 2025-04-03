import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($input: CustomerInputType!) {
    updateCustomer(input: $input) {
      id
      name
    }
  }
`;
