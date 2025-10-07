import { gql } from "@apollo/client";

export const UPDATE_EMAIL = gql`
  mutation updateEmail($input: UpdateEmailInputType!) {
    updateEmail(input: $input) {
      success
      message
      newEmail
      requiresVerification
      verificationSent
    }
  }
`;


