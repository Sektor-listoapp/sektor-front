import React from "react";

interface BrokerageSocietyCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  prop1: string;
}

const BrokerageSocietyCard = (props: BrokerageSocietyCardProps) => {
  return <article {...props}>BrokerageSocietyCard</article>;
};

export default BrokerageSocietyCard;
