import { gql } from "@apollo/client";
import { ORGANIZATION_OFFICE_FIELDS_FRAGMENT } from "./organization-fields";
import { PUBLIC_ORGANIZATION_FIELDS_FRAGMENT } from "./public-organization-fields";
import { SOCIAL_MEDIA_LINK_FIELDS_FRAGMENT } from "./social-media-link-fields";

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
    logoUrl
    type
    isActive
    lineOfBusiness
    coverageStates
    modality
    serviceType
    motto
    socialMediaLinks {
      ...SocialMediaLinkFields
    }
    allies {
      ...PublicOrganizationFields
    }
    offices {
      ...OrganizationOfficeFields
    }
    services {
      ...SupplierServiceFields
    }
  }

  ${SOCIAL_MEDIA_LINK_FIELDS_FRAGMENT}
  ${PUBLIC_ORGANIZATION_FIELDS_FRAGMENT}
  ${ORGANIZATION_OFFICE_FIELDS_FRAGMENT}
  ${SUPPLIER_SERVICE_FIELDS_FRAGMENT}
`;
