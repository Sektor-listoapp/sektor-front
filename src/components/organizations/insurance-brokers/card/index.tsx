import React from "react";

interface InsuranceBrokerCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  prop1: string;
}

const InsuranceBrokerCard = (props: InsuranceBrokerCardProps) => {
  return <article {...props}>InsuranceBrokerCard</article>;
};

export default InsuranceBrokerCard;
