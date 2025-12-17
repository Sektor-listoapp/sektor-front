import { gql } from "@apollo/client";
import { MODULE_FIELDS_FRAGMENT } from "../../fragments/module-fields";

export const MODULE_BY_ID_QUERY = gql`
  query moduleById($id: ID!) {
    moduleById(id: $id) {
      ...ModuleFields
    }
  }
  ${MODULE_FIELDS_FRAGMENT}
`;


