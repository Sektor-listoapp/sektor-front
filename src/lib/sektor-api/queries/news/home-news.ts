import { gql } from "@apollo/client";

export const HOME_NEWS_QUERY = gql`
  query homeNews {
    homeNews {
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
    }
  }
`;

