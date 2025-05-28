import { gql } from "@apollo/client";

export const UPLOAD_ORGANIZATION_TEMPLATE_MUTATION = gql`
  mutation UploadOrganizationTemplate($file: String!) {
    uploadOrganizationTemplate(file: $file) {
      type
      status
      message
    }
  }
`;