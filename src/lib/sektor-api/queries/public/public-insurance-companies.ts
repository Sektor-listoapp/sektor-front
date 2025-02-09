import { gql } from "@apollo/client";
import { INSURANCE_COMPANY_FIELDS_FRAGMENT } from "../../fragments";

export const PUBLIC_INSURANCE_COMPANIES_QUERY = gql`
  query getPublicInsuranceCompanies(
    $pagination: PaginationType
    $filter: InsuranceCompanyFilterType
  ) {
    publicInsuranceCompanies(pagination: $pagination, filter: $filter) {
      items {
        ...InsuranceCompanyFields
      }
      count
      pages
    }
  }

  ${INSURANCE_COMPANY_FIELDS_FRAGMENT}
`;

export const PUBLIC_INSURANCE_COMPANY_BY_ID_QUERY = gql`
  query getInsuranceCompanyById($id: String!) {
    publicInsuranceCompanyById(id: $id) {
      ...InsuranceCompanyFields
    }
  }

  ${INSURANCE_COMPANY_FIELDS_FRAGMENT}
`;
