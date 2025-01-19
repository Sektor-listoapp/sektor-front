import React from "react";

interface SupplierCardProps extends React.HTMLAttributes<HTMLDivElement> {
  prop1: string;
}

const SupplierCard = (props: SupplierCardProps) => {
  return <article {...props}>SupplierCard</article>;
};

export default SupplierCard;
