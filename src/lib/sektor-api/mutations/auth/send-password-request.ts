import { gql } from "@apollo/client";

export const SEND_PASSWORD_RESET_REQUEST = gql`
  mutation sendPasswordResetRequest($email: String!) {
    sendPasswordResetRequest(email: $email)
  }
`;
