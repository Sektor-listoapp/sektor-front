import { gql } from "@apollo/client";

export const CHANGE_ORGANIZATION_VISIBILITY = gql`
  mutation changeOrganizationVisibility(
    $input: ChangeOrganizationVisibilityInputType!
  ) {
    changeOrganizationVisibility(input: $input) {
      id
      name
    }
  }
`;
