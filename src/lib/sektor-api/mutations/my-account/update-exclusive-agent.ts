import { gql } from "@apollo/client";

export const UPDATE_EXCLUSIVE_AGENT = gql`
  mutation updateExclusiveAgent($input: ExclusiveAgentInputType!) {
    updateExclusiveAgent(input: $input) {
      id
      name
    }
  }
`;
