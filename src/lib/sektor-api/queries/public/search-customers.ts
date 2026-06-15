import { gql } from "@apollo/client";

export const LIST_CUSTOMERS_FOR_ADMIN = gql`
  query listCustomersForAdmin($targetTypes: [SurveyTarget!]!) {
    surveyTargetCandidates(targetTypes: $targetTypes) {
      id
      name
      email
      type
    }
  }
`;
