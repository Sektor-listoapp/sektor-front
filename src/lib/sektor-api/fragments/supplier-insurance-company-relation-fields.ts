import { gql } from "@apollo/client";

export const SUPPLIER_INSURANCE_COMPANY_RELATION_FIELDS_FRAGMENT = gql`
  fragment SupplierInsuranceCompanyRelationFields on SupplierInsuranceCompanyRelationType {
    insuranceCompanyId
    depositRequired
    fullyContractedClinic
    reasonableExpensesApplicable
  }
`;
