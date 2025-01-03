import { gql } from "@apollo/client";

export const SEND_VERIFICATION_EMAIL = gql`
  mutation sendVerificationEmail($email: String!) {
    sendVerificationEmail(email: $email)
  }
`;
