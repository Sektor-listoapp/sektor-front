export const REGISTER_AS_EXCLUSIVE_AGENT = `
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
