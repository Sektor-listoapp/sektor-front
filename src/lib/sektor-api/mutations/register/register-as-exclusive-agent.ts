import { gql } from "@apollo/client";

export const REGISTER_AS_EXCLUSIVE_AGENT = gql`
  mutation registerAsExclusiveAgent(
    $input: RegisterAsExclusiveAgentInputType!
  ) {
    registerAsExclusiveAgent(input: $input) {
      userId
      id
      name
      type
    }
  }
`;
