import { gql } from "@apollo/client";

export const WORKSHOPS_SIMPLE_QUERY = gql`
  query Workshops(
    $pagination: PaginationType
    $filter: SupplierFilterType
  ) {
    publicSuppliers(pagination: $pagination, filter: $filter) {
      pages
      count
      items {
        id
        name
        logoUrl
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
