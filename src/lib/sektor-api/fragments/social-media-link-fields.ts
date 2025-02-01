import { gql } from "@apollo/client";

export const SOCIAL_MEDIA_LINK_FIELDS_FRAGMENT = gql`
  fragment SocialMediaLinkFields on SocialMediaLinkType {
    url
    platform
  }
`;
