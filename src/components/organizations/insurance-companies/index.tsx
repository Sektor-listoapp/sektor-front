import React from "react";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import { USER_TYPES } from "@/constants/auth";
import Button from "@/components/ui/button";

interface InsuranceCompaniesProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const InsuranceCompanies = ({
  className,
  ...props
}: InsuranceCompaniesProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.INSURANCE_COMPANY;

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace({
      query: { ...newQueryParams, type: USER_TYPES.INSURANCE_COMPANY },
    });
  };

  return (
    <section className={cn("w-full", className)} {...props}>
      <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
        <h2>Compañías de seguros</h2>
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

export default InsuranceCompanies;
