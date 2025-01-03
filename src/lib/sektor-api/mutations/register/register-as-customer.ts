import { gql } from "@apollo/client";

export const REGISTER_AS_CUSTOMER = gql`
  mutation registerAsCustomer($input: RegisterAsCustomerInputType!) {
    registerAsCustomer(input: $input) {
      userId
      customerId
    }
  }
`;
