import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const UPLOAD_FILE_TO_MODULE = gql`
  mutation uploadFileToModule($moduleId: ID!, $file: File!) {
    uploadFileToModule(moduleId: $moduleId, file: $file) {
      ...ModuleFields
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;


