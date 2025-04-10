import { gql } from "@apollo/client";

export const CUSTOMER_FIELDS_FRAGMENT = gql`
  fragment CustomerFields on CustomerType {
    id
    name
    email
    deletedAt
    verifiedAt
    group
    birthdate
    sex
  }
`;
