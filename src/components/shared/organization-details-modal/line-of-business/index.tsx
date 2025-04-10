import React from "react";
import { cn } from "@/utils/class-name";
import { OrganizationLineOfBusiness as OrganizationLineOfBusinessType } from "@/lib/sektor-api/__generated__/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LINE_OF_BUSINESS_CONTENT_MAP } from "./constants";

interface OrganizationLineOfBusinessProps
  extends React.HTMLAttributes<HTMLDivElement> {
  lineOfBusiness: OrganizationLineOfBusinessType[];
  heading?: string;
}

const OrganizationLineOfBusiness = ({
  lineOfBusiness,
  heading,
  className,
  ...props
}: OrganizationLineOfBusinessProps) => {
  return (
    <section
      className={cn("w-full text-blue-500 flex flex-col gap-10 mt-5", className)}
      {...props}
    >
      <h3 className="text-xl w-full font-semibold font-century-gothic lg:text-2xl">
        {heading || "Los ramos con los que trabajo"}
      </h3>

      <div className="w-full flex flex-col gap-8">
        {lineOfBusiness.map((lob, index) => {
          const { icon, content } = LINE_OF_BUSINESS_CONTENT_MAP[lob];
          return (
            <div
              className="w-full font-century-gothic text-sm text-blue-500 flex items-start gap-5 lg:text-base"
              key={`lob-${index}-${lob}`}
            >
              <FontAwesomeIcon icon={icon} size="3x" />
              <p>{content}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OrganizationLineOfBusiness;
