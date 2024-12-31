export const UPDATE_PASSWORD = `
  mutation updatePassword($input: UpdatePasswordInputType!) {
    updatePassword(input: $input)
  }
`;
