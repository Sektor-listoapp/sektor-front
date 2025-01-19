import { cn } from "@/utils/class-name";
import React from "react";

interface ExclusiveAgentsProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const ExclusiveAgents = ({ className, ...props }: ExclusiveAgentsProps) => {
  return (
    <section className={cn("w-full", className)} {...props}>
      <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg">
        <h2>Agentes exclusivos</h2>
      </header>
    </section>
  );
};

export default ExclusiveAgents;
