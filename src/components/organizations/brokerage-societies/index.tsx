import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/shared";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import React from "react";
import BrokerageSocietyCard from "./card";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { useShallow } from "zustand/shallow";

interface BrokerageSocietiesProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const BrokerageSocieties = ({
  className,
  ...props
}: BrokerageSocietiesProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.BROKERAGE_SOCIETY;
  const brokerageSocieties =
    usePublicOrganizationsStore(
      useShallow((state) => state.publicOrganizations?.brokerageSocieties)
    ) || [];

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace({
      query: { ...newQueryParams, type: USER_TYPES.BROKERAGE_SOCIETY },
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
        <h2>Sociedades de corretaje</h2>
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

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brokerageSocieties?.map((item, index) => (
          <BrokerageSocietyCard
            data={item}
            key={`brokerage-society-card-${item?.id}-${index}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BrokerageSocieties;
