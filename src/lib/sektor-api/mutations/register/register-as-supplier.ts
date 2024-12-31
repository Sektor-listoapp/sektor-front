export const REGISTER_AS_SUPPLIER = `
  mutation registerAsSupplier($input: RegisterAsSupplierInputType!) {
    registerAsSupplier(input: $input) {
      userId
      id
      name
      type
    }
  }
`;
