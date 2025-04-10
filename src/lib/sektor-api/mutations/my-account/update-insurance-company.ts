import { gql } from "@apollo/client";

export const UPDATE_INSURANCE_COMPANY = gql`
  mutation updateInsuranceCompany($input: InsuranceCompanyInputType!) {
    updateInsuranceCompany(input: $input) {
      id
      name
    }
  }
`;
