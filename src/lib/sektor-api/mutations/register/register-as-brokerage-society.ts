export const REGISTER_AS_BROKERAGE_SOCIETY = `
  mutation registerAsBrokerageSociety(
    $input: RegisterAsBrokerageSocietyInputType!
  ) {
    registerAsBrokerageSociety(input: $input) {
      userId
      id
      name
      type
    }
  }
`;
