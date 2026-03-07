import { gql } from "@apollo/client";



export const CLINICS_SIMPLE_QUERY = gql`
  query Clinics($filter: SupplierFilterType) {
    clinics(filter: $filter) {
      pages
      count
      items {
        id
        name
        insuranceCompanies {
          id
          name
        }
        insuranceCompanyRelations {
          insuranceCompanyId
          depositRequired
          fullyContractedClinic
          reasonableExpensesApplicable
        }
        socialMediaLinks {
          platform
          url
        }
        offices {
          name
          phone
          address {
            street
            state {
              id
              name
            }
            city {
              id
              name
            }
            country {
              id
              name
            }
          }
        }
      }
    }
  }
`;

