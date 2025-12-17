import { gql } from "@apollo/client";

export const DELETE_NEWS = gql`
  mutation deleteNews($id: String!) {
    deleteNews(id: $id)
  }
`;

