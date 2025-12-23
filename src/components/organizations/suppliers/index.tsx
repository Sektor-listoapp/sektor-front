import React from "react";
import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/shared";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import { useShallow } from "zustand/shallow";
import SupplierCard from "./card";
import CardCarousel from "@/components/ui/card-carousel";
import { Empty } from "antd";
import usePublicOrganizations from "@/hooks/use-public-organizations";
import Pagination from "@/components/ui/pagination";

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
  const paginationInfo = usePublicOrganizationsStore(
    useShallow((state) => state.publicOrganizations?.pagination?.suppliers)
  );
  const { handleChangePage, isLoadingPublicOrganizations } = usePublicOrganizations({});

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace(
      { query: { ...newQueryParams, type: USER_TYPES.SUPPLIER } },
      undefined,
      { scroll: false }
    );
  };

  const handlePageChange = (page: number) => {
    handleChangePage("supplier", page, 12);
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

      {Boolean(suppliers?.length) ? (
        <>
          <CardCarousel className="w-full lg:hidden relative items-stretch">
            {suppliers?.map((item, index) => (
              <div
                className="w-auto h-full"
                key={`insurance-company-card-${item?.id}-${index}`}
              >
                <SupplierCard data={item} />
              </div>
            ))}
          </CardCarousel>

          <div className="hidden lg:grid w-full grid-cols-2 gap-10 justify-items-center 2xl::justify-items-start">
            {suppliers?.map((item, index) => (
              <SupplierCard
                data={item}
                key={`supplier-card-${item?.id}-${index}`}
              />
            ))}
          </div>

          {isSelected && paginationInfo && paginationInfo.pages > 1 && (
            <Pagination
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.pages}
              onPageChange={handlePageChange}
              disabled={isLoadingPublicOrganizations}
            />
          )}
        </>
      ) : (
        <Empty description="No hay proveedores disponibles" />
      )}
    </section>
  );
};

export default Suppliers;
