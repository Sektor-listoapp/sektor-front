import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/auth";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import React from "react";

interface SuppliersProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const Suppliers = ({ className, ...props }: SuppliersProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.SUPPLIER;

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace({
      query: { ...newQueryParams, type: USER_TYPES.SUPPLIER },
    });
  };

  return (
    <section className={cn("w-full", className)} {...props}>
      <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
        <h2>Proveedores</h2>
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

export default Suppliers;
