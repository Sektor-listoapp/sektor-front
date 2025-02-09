import { SocialMediaLinkType } from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { SOCIAL_MEDIA_LINK_ICONS } from "./constants";

interface OrganizationSocialMediaLinksProps
  extends React.HTMLAttributes<HTMLDivElement> {
  socialMediaLinks: SocialMediaLinkType[];
}

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
        return (
          <button
            className="w-fit flex items-center justify-start gap-3"
            key={`${platform}-${index}`}
            onClick={() => window.open(url, "_blank")}
          >
            <FontAwesomeIcon icon={icon} />
            <span className="underline">{platform}</span>
          </button>
        );
      })}
    </section>
  );
};

export default OrganizationSocialMediaLinks;
