import { gql } from "@apollo/client";

export const REGISTER_AS_BROKERAGE_SOCIETY = gql`
  mutation registerAsBrokerageSociety(
    $input: RegisterAsBrokerageSocietyInputType!
  ) {
    registerAsBrokerageSociety(input: $input) {
      id
      name
      type
      userId
    }
  }
`;
