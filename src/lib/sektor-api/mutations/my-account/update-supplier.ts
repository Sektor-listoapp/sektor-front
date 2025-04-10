import { gql } from "@apollo/client";

export const UPDATE_SUPPLIER = gql`
  mutation updateSupplier($input: SupplierInputType!) {
    updateSupplier(input: $input) {
      id
      name
    }
  }
`;
