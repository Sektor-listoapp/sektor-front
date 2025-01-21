import { gql } from "@apollo/client";

export const PUBLIC_INSURANCE_COMPANIES_QUERY = gql`
  query getPublicInsuranceCompanies(
    $pagination: PaginationType
    $filter: InsuranceCompanyFilterType
  ) {
    publicInsuranceCompanies(pagination: $pagination, filter: $filter) {
      items {
        id
        name
        type
        logoUrl
        createdAt
        lineOfBusiness
        modality
        contact
        address {
          street
          city
          state
          country
        }
      }
      count
      pages
    }
  }
`;
