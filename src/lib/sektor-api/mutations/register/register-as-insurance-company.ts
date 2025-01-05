import { gql } from "@apollo/client";

export const REGISTER_AS_INSURANCE_COMPANY = gql`
  mutation registerAsInsuranceCompany(
    $input: RegisterRequestInsuranceCompanyInputType!
  ) {
    registerAsInsuranceCompany(input: $input) {
      userId
      id
      name
      type
    }
  }
`;
