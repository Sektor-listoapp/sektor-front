import { gql } from "@apollo/client";
import { SUPPLIER_FIELDS_FRAGMENT } from "../../fragments";

export const PUBLIC_SUPPLIERS_QUERY = gql`
  query getPublicSuppliers(
    $pagination: PaginationType
    $filter: SupplierFilterType
  ) {
    publicSuppliers(pagination: $pagination, filter: $filter) {
      items {
        ...SupplierFields
      }
      count
      pages
    }
  }

  ${SUPPLIER_FIELDS_FRAGMENT}
`;

export const PUBLIC_SUPPLIER_BY_ID_QUERY = gql`
  query getSupplierById($id: String!) {
    publicSupplierById(id: $id) {
      ...SupplierFields
    }
  }

  ${SUPPLIER_FIELDS_FRAGMENT}
`;
