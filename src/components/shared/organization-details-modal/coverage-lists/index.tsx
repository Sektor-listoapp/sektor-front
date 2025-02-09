import React from "react";
import { cn } from "@/utils/class-name";
import { OrganizationLineOfBusiness as OrganizationLineOfBusinessType } from "@/lib/sektor-api/__generated__/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LINE_OF_BUSINESS_CONTENT_MAP } from "./constants";

interface OrganizationLineOfBusinessProps
  extends React.HTMLAttributes<HTMLDivElement> {
  lineOfBusiness: OrganizationLineOfBusinessType[];
}

const OrganizationCoverageLists = ({
  lineOfBusiness,
  className,
  ...props
}: OrganizationLineOfBusinessProps) => {
  return (
    <section
      className={cn(
        "w-full border-2 border-red-500 grid grid-cols-2 text-blue-500 gap-10 mt-5 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {lineOfBusiness.map((lob, index) => {
        const { icon, label } = LINE_OF_BUSINESS_CONTENT_MAP[lob];
        return (
          <div
            className="w-full font-century-gothic text-blue-500 flex flex-col items-center justify-center gap-5 text-base bg-blue-200 h-40 rounded-lg"
            key={`lob-${index}-${lob}`}
          >
            <FontAwesomeIcon icon={icon} size="3x" />
            <span>{label}</span>
          </div>
        );
      })}
    </section>
  );
};

export default OrganizationCoverageLists;
