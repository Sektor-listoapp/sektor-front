import React from "react";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import { USER_TYPES } from "@/constants/shared";
import Button from "@/components/ui/button";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { useShallow } from "zustand/shallow";
import InsuranceCompanyCard from "./card";
import CardCarousel from "@/components/ui/card-carousel";
import { Empty } from "antd";
import usePublicOrganizations from "@/hooks/use-public-organizations";
import Pagination from "@/components/ui/pagination";

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
  const insuranceCompanies =
    usePublicOrganizationsStore(
      useShallow((state) => state.publicOrganizations?.insuranceCompanies)
    ) || [];
  const paginationInfo = usePublicOrganizationsStore(
    useShallow((state) => state.publicOrganizations?.pagination?.insuranceCompanies)
  );
  const { handleChangePage, isLoadingPublicOrganizations } = usePublicOrganizations({});

  const handleClick = () => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    replace(
      { query: { ...newQueryParams, type: USER_TYPES.INSURANCE_COMPANY } },
      undefined,
      { scroll: false }
    );
  };

  const handlePageChange = (page: number) => {
    handleChangePage("insuranceCompany", page, 12);
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

      {Boolean(insuranceCompanies?.length) ? (
        <>
          <CardCarousel className="w-full md:hidden">
            {insuranceCompanies?.map((item, index) => (
              <div
                className="w-full"
                key={`insurance-company-card-${item?.id}-${index}`}
              >
                <InsuranceCompanyCard data={item} />
              </div>
            ))}
          </CardCarousel>

          <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
            {insuranceCompanies?.map((item, index) => (
              <InsuranceCompanyCard
                data={item}
                key={`insurance-company-card-${item?.id}-${index}`}
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
        <Empty description="No hay compañías de seguros disponibles" />
      )}
    </section>
  );
};

export default InsuranceCompanies;
