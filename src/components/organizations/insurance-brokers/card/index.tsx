import { PublicInsuranceBroker } from "@/types/public";
import { cn } from "@/utils/class-name";
import React from "react";

interface InsuranceBrokerCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicInsuranceBroker;
}

const InsuranceBrokerCard = ({
  data,
  className,
  ...props
}: InsuranceBrokerCardProps) => {
  const { name } = data;

  return (
    <article
      className={cn("w-full border-2 border-red-500", className)}
      {...props}
    >
      <h3>{name}</h3>
    </article>
  );
};

export default InsuranceBrokerCard;
