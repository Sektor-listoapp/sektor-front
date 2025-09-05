import { gql } from "@apollo/client";

export const INSURANCE_COMPANIES_QUERY = gql`
  query publicInsuranceCompanies($pagination: PaginationType) {
    publicInsuranceCompanies(pagination: $pagination) {
      items {
        id
        name
      }
      count
      pages
    }
  }
`;

