import { PublicExclusiveAgent } from "@/types/public";
import { cn } from "@/utils/class-name";
import React from "react";

interface ExclusiveAgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicExclusiveAgent;
}

const ExclusiveAgentCard = ({
  data,
  className,
  ...props
}: ExclusiveAgentCardProps) => {
  const { name } = data;

  return (
    <article
      className={cn("w-full border-2 border-green-300", className)}
      {...props}
    >
      <h3>{name}</h3>
    </article>
  );
};

export default ExclusiveAgentCard;
