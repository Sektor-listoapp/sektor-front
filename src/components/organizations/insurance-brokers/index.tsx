import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/auth";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import React from "react";

interface InsuranceBrokersProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const InsuranceBrokers = ({ className, ...props }: InsuranceBrokersProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.INSURANCE_BROKER;

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace({
      query: { ...newQueryParams, type: USER_TYPES.INSURANCE_BROKER },
    });
  };

  return (
    <section className={cn("w-full", className)} {...props}>
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
    </section>
  );
};

export default InsuranceBrokers;
