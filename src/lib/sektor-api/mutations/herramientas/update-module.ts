import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const UPDATE_MODULE = gql`
  mutation updateModule($id: ID!, $input: UpdateModuleInputType!) {
    updateModule(id: $id, input: $input) {
      ...ModuleFields
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;


