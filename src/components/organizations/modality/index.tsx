import React from "react";
import { cn } from "@/utils/class-name";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ORGANIZATION_MODALITY_ICON,
  ORGANIZATION_MODALITY_LABEL,
} from "./constants";
import { OrganizationModality as OrganizationModalityType } from "@/lib/sektor-api/__generated__/types";

interface OrganizationModalityProps
  extends React.HTMLAttributes<HTMLDivElement> {
  modality: OrganizationModalityType;
}

const OrganizationModality = ({
  modality,
  className,
  ...props
}: OrganizationModalityProps) => {
  const modalityKey = modality as keyof typeof ORGANIZATION_MODALITY_LABEL;
  const label = ORGANIZATION_MODALITY_LABEL[modalityKey];
  const icon = ORGANIZATION_MODALITY_ICON[modalityKey];

  return (
    <div
      className={cn("w-fit flex items-center justify-center gap-1", className)}
      {...props}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      {label}
    </div>
  );
};

export default OrganizationModality;
