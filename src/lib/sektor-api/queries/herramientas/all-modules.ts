import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const ALL_MODULES_QUERY = gql`
  query allModules($filter: ModuleFilterInputType) {
    allModules(filter: $filter) {
      ...ModuleFields
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;


