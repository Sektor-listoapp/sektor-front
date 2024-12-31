export const PROFILE_QUERY = `
  query profile {
    profile {
      id
      name
      verifiedAt
      email
      companies
      group
    }
  }
`;
