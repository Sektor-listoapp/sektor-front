import { gql } from "@apollo/client";

export const UPDATE_ORGANIZATION_LOGO = gql`
  mutation updateOrganizationLogo($logo: File, $organizationId: String) {
    updateOrganizationLogo(logo: $logo, organizationId: $organizationId) {
      id
    }
  }
`;