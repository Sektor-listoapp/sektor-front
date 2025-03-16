import { gql } from "@apollo/client";

export const UPDATE_INSURANCE_BROKER = gql`
  mutation updateInsuranceBroker($input: InsuranceBrokerInputType!) {
    updateInsuranceBroker(input: $input) {
      id
      name
    }
  }
`;
