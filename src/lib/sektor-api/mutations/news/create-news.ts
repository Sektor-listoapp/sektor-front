import { gql } from "@apollo/client";

export const CREATE_NEWS = gql`
  mutation createNews($input: NewsInputType!, $photo: File) {
    createNews(input: $input, photo: $photo) {
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

