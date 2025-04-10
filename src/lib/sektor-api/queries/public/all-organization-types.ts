import { gql } from "@apollo/client";
import {
  BROKERAGE_SOCIETY_FIELDS_FRAGMENT,
  EXCLUSIVE_AGENT_FIELDS_FRAGMENT,
  INSURANCE_BROKER_FIELDS_FRAGMENT,
  INSURANCE_COMPANY_FIELDS_FRAGMENT,
  SUPPLIER_FIELDS_FRAGMENT,
} from "../../fragments";

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
        ...SupplierFields
      }
      count
      pages
    }
    publicExclusiveAgents(
      pagination: $pagination
      filter: $publicExclusiveAgentFilters
    ) {
      items {
        ...ExclusiveAgentFields
      }
      count
      pages
    }
    publicInsuranceBrokers(
      pagination: $pagination
      filter: $publicInsuranceBrokersFilters
    ) {
      items {
        ...InsuranceBrokerFields
      }
      count
      pages
    }
    publicInsuranceCompanies(
      pagination: $pagination
      filter: $publicInsuranceCompanyFilters
    ) {
      items {
        ...InsuranceCompanyFields
      }
      count
      pages
    }
    publicBrokerageSocieties(
      pagination: $pagination
      filter: $publicBrokerageSocietyFilters
    ) {
      items {
        ...BrokerageSocietyFields
      }
      count
      pages
    }
  }

  ${SUPPLIER_FIELDS_FRAGMENT}
  ${EXCLUSIVE_AGENT_FIELDS_FRAGMENT}
  ${INSURANCE_BROKER_FIELDS_FRAGMENT}
  ${INSURANCE_COMPANY_FIELDS_FRAGMENT}
  ${BROKERAGE_SOCIETY_FIELDS_FRAGMENT}
`;
