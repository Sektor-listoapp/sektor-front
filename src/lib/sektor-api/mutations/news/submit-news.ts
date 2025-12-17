import { gql } from "@apollo/client";

export const SUBMIT_NEWS = gql`
  mutation submitNews($input: NewsInputType!, $photo: File) {
    submitNews(input: $input, photo: $photo) {
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

