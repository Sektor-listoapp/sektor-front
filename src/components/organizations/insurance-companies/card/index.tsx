import { PublicInsuranceCompany } from "@/types/public";
import { cn } from "@/utils/class-name";
import React from "react";

interface InsuranceCompanyCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicInsuranceCompany;
}

const InsuranceCompanyCard = ({
  data,
  className,
  ...props
}: InsuranceCompanyCardProps) => {
  const { name } = data;

  return (
    <article
      className={cn("w-full border-2 border-orange-300", className)}
      {...props}
    >
      <h3>{name}</h3>
    </article>
  );
};

export default InsuranceCompanyCard;
