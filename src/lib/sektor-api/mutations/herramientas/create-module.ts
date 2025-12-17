import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const CREATE_MODULE = gql`
  mutation createModule($input: CreateModuleInputType!) {
    createModule(input: $input) {
      ...ModuleFields
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;


