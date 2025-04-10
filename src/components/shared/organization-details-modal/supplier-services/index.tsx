import { SupplierServiceType } from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import React from "react";

interface SupplierServicesProps extends React.HTMLAttributes<HTMLDivElement> {
  services: SupplierServiceType[];
}

const SupplierServices = ({
  services,
  className,
  ...props
}: SupplierServicesProps) => {
  return (
    <section className={cn("w-full", className)} {...props}>
      <ul className="grid grid-cols-1 gap-4 mt-2">
        {services.map((service) => (
          <li key={service.id} className="flex flex-col w-full items-center gap-1 text-blue-500">
            <span className="text-lg w-full font-bold">{service.name}</span>
            <span className="text-sm w-full font-century-gothic md:text-base">{service.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SupplierServices;
