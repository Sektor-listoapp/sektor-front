import { gql } from "@apollo/client";

export const UPDATE_ORGANIZATION_LOGO = gql`
  mutation updateOrganizationLogo($id: String!, $logo: File) {
    updateOrganizationLogo(id: $id, logo: $logo) {
      id
    }
  }
`;