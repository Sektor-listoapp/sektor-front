import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const GET_MODULE_UPLOAD_URL = gql`
  mutation GetModuleUploadUrl($moduleId: ID!, $fileName: String!, $contentType: String!, $size: Int!) {
    getModuleUploadUrl(
      moduleId: $moduleId
      fileName: $fileName
      contentType: $contentType
      size: $size
    ) {
      signedUrl
      module {
        ...ModuleFields
      }
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;

