export const REGISTER_AS_CUSTOMER = `
  mutation registerAsCustomer($input: RegisterAsCustomerInputType!) {
    registerAsCustomer(input: $input) {
      userId
      customerId
    }
  }
`;
