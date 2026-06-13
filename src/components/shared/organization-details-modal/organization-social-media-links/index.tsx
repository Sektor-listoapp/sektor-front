import {
  SocialMediaLinkType,
  SocialMediaPlatform,
} from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import { buildSocialMediaHref } from "@/utils/social-media/build-social-media-url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { SOCIAL_MEDIA_LINK_ICONS } from "./constants";

interface OrganizationSocialMediaLinksProps
  extends React.HTMLAttributes<HTMLDivElement> {
  socialMediaLinks: SocialMediaLinkType[];
}

const { EmergencyPhone, Phone, Whatsapp } = SocialMediaPlatform;

const PHONE_PLATFORMS = [EmergencyPhone, Phone, Whatsapp];

const removeDuplicateSocialMediaLinks = (
  links: SocialMediaLinkType[]
): SocialMediaLinkType[] => {
  const seen = new Set<string>();
  return links.filter((link) => {

    const normalizedUrl = link.url.toLowerCase().trim();
    const key = `${link.platform}-${normalizedUrl}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const OrganizationSocialMediaLinks = ({
  socialMediaLinks,
  className,
  ...props
}: OrganizationSocialMediaLinksProps) => {

  const uniqueLinks = removeDuplicateSocialMediaLinks(socialMediaLinks);

  return (
    <section
      className={cn(
        "w-full flex flex-col justify-start items-start gap-4",
        className
      )}
      {...props}
    >
      {uniqueLinks.map((link, index) => {
        const { platform, url } = link;
        const icon = SOCIAL_MEDIA_LINK_ICONS[platform];

        const isPhoneNumber = PHONE_PLATFORMS.includes(platform);
        const href = buildSocialMediaHref(platform, url);

        return (
          <a
            className="w-fit flex items-center justify-start gap-3 text-blue-500"
            key={`${platform}-${url}-${index}`}
            href={href}
            target={isPhoneNumber && platform !== Whatsapp ? undefined : "_blank"}
            rel="noreferrer noopener"
          >
            <FontAwesomeIcon icon={icon} />
            <span className="underline">{isPhoneNumber ? url : platform}</span>
          </a>
        );
      })}
    </section>
  );
};

export default OrganizationSocialMediaLinks;
