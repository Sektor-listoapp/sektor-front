import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/shared";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import React from "react";
import { useShallow } from "zustand/shallow";
import SupplierCard from "./card";

interface SuppliersProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const Suppliers = ({ className, ...props }: SuppliersProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.SUPPLIER;
  const suppliers =
    usePublicOrganizationsStore(
      useShallow((state) => state.publicOrganizations?.suppliers)
    ) || [];

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace({
      query: { ...newQueryParams, type: USER_TYPES.SUPPLIER },
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

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers?.map((item, index) => (
          <SupplierCard
            data={item}
            key={`supplier-card-${item?.id}-${index}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Suppliers;
