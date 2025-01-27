import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/shared";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import React from "react";
import { useShallow } from "zustand/shallow";
import InsuranceBrokerCard from "./card";
import CardCarousel from "@/components/ui/card-carousel";

interface InsuranceBrokersProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const InsuranceBrokers = ({ className, ...props }: InsuranceBrokersProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.INSURANCE_BROKER;
  const insuranceBrokers =
    usePublicOrganizationsStore(
      useShallow((state) => state.publicOrganizations?.insuranceBrokers)
    ) || [];

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace({
      query: { ...newQueryParams, type: USER_TYPES.INSURANCE_BROKER },
    });
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
        <h2>Corredores de seguros</h2>
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

      <CardCarousel className="w-full md:hidden">
        {insuranceBrokers?.map((item, index) => (
          <div
            className="w-full"
            key={`insurance-company-card-${item?.id}-${index}`}
          >
            <InsuranceBrokerCard data={item} />
          </div>
        ))}
      </CardCarousel>

      <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
        {insuranceBrokers?.map((item, index) => (
          <InsuranceBrokerCard
            data={item}
            key={`insurance-broker-card-${item.id}-${index}`}
          />
        ))}
      </div>
    </section>
  );
};

export default InsuranceBrokers;
