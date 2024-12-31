export const LOGIN = `
  mutation login($input: LoginInputType!) {
    login(input: $input) {
      token
      __typename
      user {
        id
        email
        name
        __typename
      }
    }
  }
`;
