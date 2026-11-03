import { gql } from "@apollo/client";

export const ACTIVE_ADVERTISEMENTS_QUERY = gql`
  query activeAdvertisements {
    activeAdvertisements {
      id
      title
      sponsorName
      url
      imageUrl
    }
  }
`;
