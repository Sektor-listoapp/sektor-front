import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const DELETE_FILE_FROM_MODULE = gql`
  mutation deleteFileFromModule($moduleId: ID!, $fileId: ID!) {
    deleteFileFromModule(moduleId: $moduleId, fileId: $fileId) {
      ...ModuleFields
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;


