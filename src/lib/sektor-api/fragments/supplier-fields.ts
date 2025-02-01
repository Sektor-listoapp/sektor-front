import { gql } from "@apollo/client";
import { ORGANIZATION_OFFICE_FIELDS_FRAGMENT } from "./organization-fields";

export const SUPPLIER_SERVICE_FIELDS_FRAGMENT = gql`
  fragment SupplierServiceFields on SupplierServiceType {
    id
    name
    description
  }
`;

export const SUPPLIER_FIELDS_FRAGMENT = gql`
  fragment SupplierFields on SupplierType {
    id
    name
    group
    logoUrl
    type
    isActive
    lineOfBusiness
    coverageStates
    modality
    phone
    serviceType
    motto
    offices {
      ...OrganizationOfficeFields
    }
    services {
      ...SupplierServiceFields
    }
  }

  ${ORGANIZATION_OFFICE_FIELDS_FRAGMENT}
  ${SUPPLIER_SERVICE_FIELDS_FRAGMENT}
`;
