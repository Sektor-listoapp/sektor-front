import { gql } from "@apollo/client";

export const PUBLIC_SUPPLIERS_QUERY = gql`
  query getPublicSuppliers(
    $pagination: PaginationType
    $filter: SupplierFilterType
  ) {
    publicSuppliers(pagination: $pagination, filter: $filter) {
      items {
        id
        name
        type
        logoUrl
        createdAt
        lineOfBusiness
        modality
        serviceType
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
