import { gql } from "@apollo/client";

export const UPDATE_BROKERAGE_SOCIETY = gql`
  mutation updateBrokerageSociety($input: BrokerageSocietyInputType!) {
    updateBrokerageSociety(input: $input) {
      id
      name
    }
  }
`;
