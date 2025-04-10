import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/utils/class-name";
import { OrganizationModality as OrganizationModalityType } from "@/lib/sektor-api/__generated__/types";
import {
  ORGANIZATION_MODALITY_ICON,
  ORGANIZATION_MODALITY_LABEL,
} from "./constants";

interface OrganizationModalityProps
  extends React.HTMLAttributes<HTMLDivElement> {
  modality: OrganizationModalityType;
}

const OrganizationModality = ({
  modality,
  className,
  ...props
}: OrganizationModalityProps) => {
  const label = ORGANIZATION_MODALITY_LABEL[modality];
  const icon = ORGANIZATION_MODALITY_ICON[modality];
  return (
    <div
      className={cn(
        "w-full flex justify-start items-center gap-2 text-xl",
        className
      )}
      {...props}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      <span>{label}</span>
    </div>
  );
};

export default OrganizationModality;
