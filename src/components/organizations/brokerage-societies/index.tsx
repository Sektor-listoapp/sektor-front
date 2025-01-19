import { cn } from "@/utils/class-name";
import React from "react";

interface BrokerageSocietiesProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const BrokerageSocieties = ({
  className,
  ...props
}: BrokerageSocietiesProps) => {
  return (
    <section className={cn("w-full", className)} {...props}>
      <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg">
        <h2>Sociedades de corretaje</h2>
      </header>
    </section>
  );
};

export default BrokerageSocieties;
