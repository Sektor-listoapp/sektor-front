import { SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe, faPhone } from "@fortawesome/free-solid-svg-icons";

const {
  Facebook,
  Instagram,
  Twitter,
  Website,
  Whatsapp,
  EmergencyPhone,
  Phone,
} = SocialMediaPlatform;

export const SOCIAL_MEDIA_LINK_ICONS = {
  [Facebook]: faFacebook,
  [Instagram]: faInstagram,
  [Twitter]: faXTwitter,
  [Website]: faGlobe,
  [Whatsapp]: faWhatsapp,
  [EmergencyPhone]: faPhone,
  [Phone]: faPhone,
} as const;
