import { gql } from "@apollo/client";

export const PUBLIC_SUPPLIER_FIELDS_FRAGMENT = gql`
  fragment PublicSupplierFields on SupplierType {
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
`;

export const PUBLIC_SUPPLIERS_QUERY = gql`
  query getPublicSuppliers(
    $pagination: PaginationType
    $filter: SupplierFilterType
  ) {
    publicSuppliers(pagination: $pagination, filter: $filter) {
      items {
        ...PublicSupplierFields
      }
      count
      pages
    }
  }

  ${PUBLIC_SUPPLIER_FIELDS_FRAGMENT}
`;
