
export const PUBLIC_INSURANCE_BROKERS_QUERY =`
  query getPublicInsuranceBrokers {
    getPublicInsuranceBrokers {
      items {
        name
        id
        type
        logoUrl
        createdAt
        __typename
      }
      __typename
    }
  }
`;
