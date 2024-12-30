import { gql } from "@apollo/client";

export const REGISTER_AS_SUPPLIER = gql`
  mutation registerAsSupplier($input: RegisterAsSupplierInputType!) {
    registerAsSupplier(input: $input) {
      userId
      id
      name
      type
    }
  }
`;
