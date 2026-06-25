import React from "react";
import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/shared";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import { useShallow } from "zustand/shallow";
import SupplierCard from "../suppliers/card";
import CardCarousel from "@/components/ui/card-carousel";
import { Empty } from "antd";
import usePublicOrganizations from "@/hooks/use-public-organizations";
import Pagination from "@/components/ui/pagination";

interface WorkshopsProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const Workshops = ({ className, ...props }: WorkshopsProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected = orgType === USER_TYPES.SUPPLIER_WORKSHOP;
  const workshops =
    usePublicOrganizationsStore(
      useShallow((state) => state.publicOrganizations?.workshops)
    ) || [];
  const paginationInfo = usePublicOrganizationsStore(
    useShallow((state) => state.publicOrganizations?.pagination?.workshops)
  );
  const { handleChangePage, isLoadingPublicOrganizations } =
    usePublicOrganizations({});

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace(
      { query: { ...newQueryParams, type: USER_TYPES.SUPPLIER_WORKSHOP } },
      undefined,
      { scroll: false }
    );
  };

  const handlePageChange = (page: number) => {
    handleChangePage("workshop", page, 12);
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
        <h2>Talleres</h2>
        {!isSelected && Boolean(workshops?.length) && (
          <Button
            variant="link-blue"
            onClick={handleClick}
            className="text-xs text-blue-400"
          >
            Ver más
          </Button>
        )}
      </header>

      {Boolean(workshops?.length) ? (
        <>
          <CardCarousel className="w-full lg:hidden relative items-stretch">
            {workshops?.map((item, index) => (
              <div
                className="w-auto h-full"
                key={`workshop-card-${item?.id}-${index}`}
              >
                <SupplierCard data={item} />
              </div>
            ))}
          </CardCarousel>

          <div className="hidden lg:grid w-full grid-cols-2 gap-10 justify-items-center 2xl::justify-items-start">
            {workshops?.map((item, index) => (
              <SupplierCard
                data={item}
                key={`workshop-card-${item?.id}-${index}`}
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
        <Empty description="No hay talleres disponibles" />
      )}
    </section>
  );
};

export default Workshops;
