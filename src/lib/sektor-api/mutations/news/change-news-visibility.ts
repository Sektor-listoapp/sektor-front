import { gql } from "@apollo/client";

export const CHANGE_NEWS_VISIBILITY = gql`
  mutation changeNewsVisibility($id: String!, $visibility: String!) {
    changeNewsVisibility(id: $id, visibility: $visibility) {
      id
      title
      visibility
      pendingApproval
    }
  }
`;

