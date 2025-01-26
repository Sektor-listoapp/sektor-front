import { gql } from "@apollo/client";

export const PUBLIC_INSURANCE_COMPANY_FIELDS_FRAGMENT = gql`
  fragment PublicInsuranceCompanyFields on InsuranceCompanyType {
    id
    name
    type
    logoUrl
    createdAt
    lineOfBusiness
    modality
    address {
      street
      city
      state
      country
    }
  }
`;

export const PUBLIC_INSURANCE_COMPANIES_QUERY = gql`
  query getPublicInsuranceCompanies(
    $pagination: PaginationType
    $filter: InsuranceCompanyFilterType
  ) {
    publicInsuranceCompanies(pagination: $pagination, filter: $filter) {
      items {
        ...PublicInsuranceCompanyFields
      }
      count
      pages
    }
  }

  ${PUBLIC_INSURANCE_COMPANY_FIELDS_FRAGMENT}
`;
