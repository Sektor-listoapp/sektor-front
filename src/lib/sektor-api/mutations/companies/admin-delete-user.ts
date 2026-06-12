import { gql } from "@apollo/client";

export const ADMIN_DELETE_USER = gql`
  mutation adminDeleteUser($userId: String!) {
    adminDeleteUser(userId: $userId)
  }
`;
