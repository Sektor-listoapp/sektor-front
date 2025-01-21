import React from "react";

interface InsuranceCompanyCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  prop1: string;
}

const InsuranceCompanyCard = (props: InsuranceCompanyCardProps) => {
  return <article {...props}>InsuranceCompanyCard</article>;
};

export default InsuranceCompanyCard;
