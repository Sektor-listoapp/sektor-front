import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/shared";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import React from "react";
import { useShallow } from "zustand/shallow";
import ExclusiveAgentCard from "./card";
import CardCarousel from "@/components/ui/card-carousel";
import { Empty } from "antd";

interface ExclusiveAgentsProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const ExclusiveAgents = ({ className, ...props }: ExclusiveAgentsProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.EXCLUSIVE_AGENT;
  const exclusiveAgents =
    usePublicOrganizationsStore(
      useShallow((state) => state.publicOrganizations?.exclusiveAgents)
    ) || [];

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace(
      { query: { ...newQueryParams, type: USER_TYPES.EXCLUSIVE_AGENT } },
      undefined,
      { scroll: false }
    );
  };

  return (
    <section
      className={cn(
        "w-full flex flex-col items-center justify-center gap-5",
        className
      )}
      {...props}
    >
      <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
        <h2>Agentes exclusivos</h2>
        {!isSelected && (
          <Button
            variant="link-blue"
            onClick={handleClick}
            className="text-xs text-blue-400"
          >
            Ver más
          </Button>
        )}
      </header>

      {Boolean(exclusiveAgents?.length) ? (
        <>
          <CardCarousel className="w-full md:hidden relative items-stretch">
            {exclusiveAgents?.map((item, index) => (
              <div
                className="w-full h-full"
                key={`insurance-company-card-${item?.id}-${index}`}
              >
                <ExclusiveAgentCard data={item} />
              </div>
            ))}
          </CardCarousel>

          <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
            {exclusiveAgents?.map((item, index) => (
              <ExclusiveAgentCard
                data={item}
                key={`exclusive-agent-card-${item?.id}-${index}`}
              />
            ))}
          </div>
        </>
      ) : (
        <Empty description="No hay agentes exclusivos disponibles" />
      )}
    </section>
  );
};

export default ExclusiveAgents;
