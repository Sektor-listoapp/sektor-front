import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/utils/class-name";
import { Popover } from "antd";
import { LINE_OF_BUSINESS_ICON, LINE_OF_BUSINESS_LABEL } from "./constants";
import { OrganizationLineOfBusiness } from "@/lib/sektor-api/__generated__/types";

interface LineOfBusinessProps extends React.HTMLAttributes<HTMLDivElement> {
  lineOfBusiness: OrganizationLineOfBusiness[];
}

const LineOfBusiness = ({
  lineOfBusiness,
  className,
  ...props
}: LineOfBusinessProps) => {
  return (
    <div
      className={cn(
        "w-fit flex justify-center items-center gap-1 md:gap-2 2xl:gap-3",
        className
      )}
      {...props}
    >
      {lineOfBusiness.map((item, index) => {
        const itemKey = item as keyof typeof LINE_OF_BUSINESS_LABEL;
        const label = LINE_OF_BUSINESS_LABEL[itemKey];
        const icon = LINE_OF_BUSINESS_ICON[itemKey];
        return (
          <Popover key={`line-of-business-${item}-${index}`} content={label}>
            <FontAwesomeIcon icon={icon} size="lg" />
          </Popover>
        );
      })}
    </div>
  );
};

export default LineOfBusiness;
