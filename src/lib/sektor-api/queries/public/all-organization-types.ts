import { gql } from "@apollo/client";

export const ALL_ORGANIZATION_TYPES_QUERY = gql`
  query getAllOrganizations(
    $pagination: PaginationType!
    $publicSupplierFilters: SupplierFilterType
    $publicExclusiveAgentFilters: ExclusiveAgentFilterType
    $publicInsuranceBrokersFilters: InsuranceBrokerFilterType
    $publicInsuranceCompanyFilters: InsuranceCompanyFilterType
    $publicBrokerageSocietyFilters: BrokerageSocietyFilterType
  ) {
    publicSuppliers(pagination: $pagination, filter: $publicSupplierFilters) {
      items {
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
      count
      pages
    }
    publicExclusiveAgents(
      pagination: $pagination
      filter: $publicExclusiveAgentFilters
    ) {
      items {
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
      count
      pages
    }
    publicInsuranceBrokers(
      pagination: $pagination
      filter: $publicInsuranceBrokersFilters
    ) {
      items {
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
      count
      pages
    }
    publicInsuranceCompanies(
      pagination: $pagination
      filter: $publicInsuranceCompanyFilters
    ) {
      items {
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
      count
      pages
    }
    publicBrokerageSocieties(
      pagination: $pagination
      filter: $publicBrokerageSocietyFilters
    ) {
      items {
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
      count
      pages
    }
  }
`;
