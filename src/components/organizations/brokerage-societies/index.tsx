import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/shared";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import React from "react";
import BrokerageSocietyCard from "./card";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { useShallow } from "zustand/shallow";
import CardCarousel from "@/components/ui/card-carousel";
import { Empty } from "antd";
import usePublicOrganizations from "@/hooks/use-public-organizations";
import Pagination from "@/components/ui/pagination";

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
  const paginationInfo = usePublicOrganizationsStore(
    useShallow((state) => state.publicOrganizations?.pagination?.brokerageSocieties)
  );
  const { handleChangePage, isLoadingPublicOrganizations } = usePublicOrganizations({});

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace(
      { query: { ...newQueryParams, type: USER_TYPES.BROKERAGE_SOCIETY } },
      undefined,
      { scroll: false }
    );
  };

  const handlePageChange = (page: number) => {
    handleChangePage("brokerageSociety", page, 12);
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

      {Boolean(brokerageSocieties?.length) ? (
        <>
          <CardCarousel className="w-full lg:hidden relative items-stretch">
            {brokerageSocieties?.map((item, index) => (
              <div
                className="w-auto h-full"
                key={`insurance-company-card-${item?.id}-${index}`}
              >
                <BrokerageSocietyCard data={item} />
              </div>
            ))}
          </CardCarousel>

          <div className="hidden lg:grid w-full grid-cols-2 gap-10 justify-items-center 2xl::justify-items-start">
            {brokerageSocieties?.map((item, index) => (
              <BrokerageSocietyCard
                data={item}
                key={`brokerage-society-card-${item?.id}-${index}`}
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
        <Empty description="No hay sociedades de corretaje disponibles" />
      )}
    </section>
  );
};

export default BrokerageSocieties;
