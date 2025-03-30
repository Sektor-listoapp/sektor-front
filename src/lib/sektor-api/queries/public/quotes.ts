import { gql } from "@apollo/client";
import {
  PUBLIC_ORGANIZATION_FIELDS_FRAGMENT,
  QUOTE_CITY_FIELDS_FRAGMENT,
  QUOTE_CUSTOMER_FIELDS_FRAGMENT,
} from "../../fragments";

export const QUOTES_QUERY = gql`
  query quotes(
    $pagination: PaginationType
    $filter: QuoteFilterType
    $organizationId: String
  ) {
    quotes(
      pagination: $pagination
      filter: $filter
      organizationId: $organizationId
    ) {
      items {
        id
        lineOfBusiness
        read
        rating
        createdAt
        updatedAt
        organization {
          ...PublicOrganizationFields
        }
        customer {
          ...QuoteCustomerFields
        }
        city {
          ...QuoteCityFields
        }
      }
    }
  }

  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${QUOTE_CUSTOMER_FIELDS_FRAGMENT}
  ${QUOTE_CITY_FIELDS_FRAGMENT}
`;

export const PROPERTY_QUOTE_BY_ID = gql`
  query getPropertyQuoteById($id: String!) {
    propertyQuoteById(id: $id) {
      id
      lineOfBusiness
      createdAt
      updatedAt
      read
      rating
      industryAndCommerce
      residentialComplex
      comments
      organization {
        ...PublicOrganizationFields
      }
      customer {
        ...QuoteCustomerFields
      }
      city {
        ...QuoteCityFields
      }
    }
  }

  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${QUOTE_CUSTOMER_FIELDS_FRAGMENT}
  ${QUOTE_CITY_FIELDS_FRAGMENT}
`;

export const AUTO_QUOTE_BY_ID = gql`
  query getAutoQuoteById($id: String!) {
    autoQuoteById(id: $id) {
      id
      lineOfBusiness
      createdAt
      updatedAt
      read
      rating
      comments
      usageType
      coverage
      make
      model
      year
      version
      organization {
        ...PublicOrganizationFields
      }
      customer {
        ...QuoteCustomerFields
      }
      city {
        ...QuoteCityFields
      }
    }
  }

  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${QUOTE_CUSTOMER_FIELDS_FRAGMENT}
  ${QUOTE_CITY_FIELDS_FRAGMENT}
`;

export const HEALTH_QUOTE_BY_ID = gql`
  query getHealthQuoteById($id: String!) {
    healthQuoteById(id: $id) {
      id
      lineOfBusiness
      createdAt
      updatedAt
      comments
      read
      rating
      upToInsuranceAmount
      dateOfBirth
      maternity
      dental
      vision
      funeral
      primaryCare
      organization {
        ...PublicOrganizationFields
      }
      customer {
        ...QuoteCustomerFields
      }
      city {
        ...QuoteCityFields
      }
    }
  }

  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${QUOTE_CUSTOMER_FIELDS_FRAGMENT}
  ${QUOTE_CITY_FIELDS_FRAGMENT}
`;

export const OTHER_QUOTE_BY_ID = gql`
  query getOtherQuoteById($id: String!) {
    otherQuoteById(id: $id) {
      id
      lineOfBusiness
      createdAt
      updatedAt
      read
      rating
      comments
      organization {
        ...PublicOrganizationFields
      }
      customer {
        ...QuoteCustomerFields
      }
      city {
        ...QuoteCityFields
      }
    }
  }

  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${QUOTE_CUSTOMER_FIELDS_FRAGMENT}
  ${QUOTE_CITY_FIELDS_FRAGMENT}
`;
