import {
  SocialMediaLinkType,
  SocialMediaPlatform,
} from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { SOCIAL_MEDIA_LINK_ICONS } from "./constants";

interface OrganizationSocialMediaLinksProps
  extends React.HTMLAttributes<HTMLDivElement> {
  socialMediaLinks: SocialMediaLinkType[];
}

const { EmergencyPhone, Phone, Whatsapp } = SocialMediaPlatform;

const OrganizationSocialMediaLinks = ({
  socialMediaLinks,
  className,
  ...props
}: OrganizationSocialMediaLinksProps) => {
  return (
    <section
      className={cn(
        "w-full flex flex-col justify-start items-start gap-4",
        className
      )}
      {...props}
    >
      {socialMediaLinks.map((link, index) => {
        const { platform, url } = link;
        const icon = SOCIAL_MEDIA_LINK_ICONS[platform];

        const isPhoneNumber = [EmergencyPhone, Phone, Whatsapp].includes(
          platform
        );
        const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

        return (
          <a
            className="w-fit flex items-center justify-start gap-3 text-blue-500"
            key={`${platform}-${index}`}
            href={isPhoneNumber ? `tel:${url}` : normalizedUrl}
            target="_blank"
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
