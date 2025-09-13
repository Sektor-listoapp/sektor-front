import { gql } from "@apollo/client";



export const CLINICS_SIMPLE_QUERY = gql`
  query Clinics($filter: SupplierFilterType) {
    clinics(filter: $filter) {
      pages
      count
      items {
        name
        insuranceCompanyRelations {
          insuranceCompanyId
          depositRequired
          fullyContractedClinic
          reasonableExpensesApplicable
        }
      }
    }
  }
`;

