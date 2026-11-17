import { gql } from "@apollo/client";

export const ADMIN_CHANGE_USER_TYPE = gql`
  mutation adminChangeUserType($input: AdminChangeUserTypeInputType!) {
    adminChangeUserType(input: $input) {
      id
      name
      type
      isActive
    }
  }
`;
