export const SEND_PASSWORD_RESET_REQUEST = `
  mutation sendPasswordResetRequest($email: String!) {
    sendPasswordResetRequest(email: $email)
  }
`;
