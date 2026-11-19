import { gql } from "@apollo/client";

export const REGISTER_AS_OTHER = gql`
  mutation registerAsOther($input: RegisterAsOtherInputType!) {
    registerAsOther(input: $input) {
      userId
      id
      name
      type
    }
  }
`;
