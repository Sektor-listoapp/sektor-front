import { gql } from "@apollo/client";

export const UPDATE_NEWS = gql`
  mutation updateNews($id: String!, $input: NewsInputType!, $photo: File) {
    updateNews(id: $id, input: $input, photo: $photo) {
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

