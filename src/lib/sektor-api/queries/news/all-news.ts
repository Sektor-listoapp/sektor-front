import { gql } from "@apollo/client";

export const ALL_NEWS_QUERY = gql`
  query news($filter: NewsAdminFilterInputType) {
    news(filter: $filter) {
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

