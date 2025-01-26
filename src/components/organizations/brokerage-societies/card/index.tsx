import { PublicBrokerageSociety } from "@/types/public";
import { cn } from "@/utils/class-name";
import React from "react";

interface BrokerageSocietyCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicBrokerageSociety;
}

const BrokerageSocietyCard = ({
  data,
  className,
  ...props
}: BrokerageSocietyCardProps) => {
  const { name } = data;

  return (
    <article
      className={cn("w-full border-2 border-blue-300", className)}
      {...props}
    >
      <h3>{name}</h3>
    </article>
  );
};

export default BrokerageSocietyCard;
