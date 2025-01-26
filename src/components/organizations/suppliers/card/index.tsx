import { PublicSupplier } from "@/types/public";
import { cn } from "@/utils/class-name";
import React from "react";

interface SupplierCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicSupplier;
}

const SupplierCard = ({ data, className, ...props }: SupplierCardProps) => {
  const { name } = data;

  return (
    <article
      className={cn("w-full border-2 border-teal-500", className)}
      {...props}
    >
      <h3>{name}</h3>
    </article>
  );
};

export default SupplierCard;
