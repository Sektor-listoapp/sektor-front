import { SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const { Facebook, Instagram, Twitter, Website, Whatsapp } = SocialMediaPlatform;

export const SOCIAL_MEDIA_LINK_ICONS = {
  [Facebook]: faFacebook,
  [Instagram]: faInstagram,
  [Twitter]: faXTwitter,
  [Website]: faGlobe,
  [Whatsapp]: faWhatsapp,
} as const;
