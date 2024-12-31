export const REGISTER_AS_INSURANCE_BROKER = `
  mutation registerAsInsuranceBroker(
    $input: RegisterAsInsuranceBrokerInputType!
  ) {
    registerAsInsuranceBroker(input: $input) {
      userId
      id
      name
      type
    }
  }
`;
