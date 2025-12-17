import { gql } from "@apollo/client";

export const NEWS_BY_ID_QUERY = gql`
  query newsById($id: String!) {
    newsById(id: $id) {
      id
      title
      description
      photoUrl
      videoUrl
      date
      time
      type
      uploadedBy
      authorName
      visibility
      pendingApproval
      allowedRoles
    }
  }
`;
