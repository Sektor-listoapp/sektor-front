import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const MODULES_QUERY = gql`
  query modules($filter: ModuleFilterInputType) {
    modules(filter: $filter) {
      ...ModuleFields
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;


