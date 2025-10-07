import { gql } from "@apollo/client";

export const ADMIN_UPDATE_USER_EMAIL = gql`
  mutation adminUpdateUserEmail($input: AdminUpdateEmailInputType!) {
    adminUpdateUserEmail(input: $input) {
      success
      message
      newEmail
      requiresVerification
      verificationSent
    }
  }
`;


