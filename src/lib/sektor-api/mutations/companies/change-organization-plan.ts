import { gql } from "@apollo/client";

export const CHANGE_ORGANIZATION_PLAN = gql`
  mutation changeOrganizationPlan($input: ChangeOrganizationPlanInputType!) {
    changeOrganizationPlan(input: $input) {
      id
      name
    }
  }
`;
