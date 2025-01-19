import React from "react";

interface ExclusiveAgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  prop1: string;
}

const ExclusiveAgentCard = (props: ExclusiveAgentCardProps) => {
  return <article {...props}>ExclusiveAgentCard</article>;
};

export default ExclusiveAgentCard;
