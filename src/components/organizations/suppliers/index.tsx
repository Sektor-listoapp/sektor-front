import { cn } from "@/utils/class-name";
import React from "react";

interface SuppliersProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const Suppliers = ({ className, ...props }: SuppliersProps) => {
  return (
    <section className={cn("w-full", className)} {...props}>
      <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg">
        <h2>Proveedores</h2>
      </header>
    </section>
  );
};

export default Suppliers;
