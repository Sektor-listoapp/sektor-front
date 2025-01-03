import { gql } from "@apollo/client";

export const REGISTER_AS_INSURANCE_BROKER = gql`
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
