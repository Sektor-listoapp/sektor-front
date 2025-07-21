import { gql } from "@apollo/client";
import { ORGANIZATION_OFFICE_FIELDS_FRAGMENT } from "./organization-fields";
import { SOCIAL_MEDIA_LINK_FIELDS_FRAGMENT } from "./social-media-link-fields";

export const INSURANCE_COMPANY_CONTACT_FIELDS_FRAGMENT = gql`
  fragment InsuranceCompanyContactFields on InsuranceCompanyContactType {
    name
  }

  ${SOCIAL_MEDIA_LINK_FIELDS_FRAGMENT}
`;

export const INSURANCE_COMPANY_FIELDS_FRAGMENT = gql`
  fragment InsuranceCompanyFields on InsuranceCompanyType {
    id
    name
    type
    logoUrl
    lineOfBusiness
    modality
    license
    plan
    isActive
    coverageStates
    motto
    identification
    foundationYear
    suppliers {
      id
      name
      logoUrl
    }
    offices {
      ...OrganizationOfficeFields
    }
    contact {
      ...InsuranceCompanyContactFields
    }
    socialMediaLinks {
      ...SocialMediaLinkFields
    }
  }

  ${ORGANIZATION_OFFICE_FIELDS_FRAGMENT}
  ${INSURANCE_COMPANY_CONTACT_FIELDS_FRAGMENT}
`;
