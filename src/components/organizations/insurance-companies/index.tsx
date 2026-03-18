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
import { InsuranceCompanySubtype } from "@/lib/sektor-api/__generated__/types";

interface InsuranceCompaniesProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const InsuranceCompanies = ({
  className,
  ...props
}: InsuranceCompaniesProps) => {
  const { query, replace } = useRouter();
  const orgType = query?.type;
  const isSelected =
    orgType === USER_TYPES.INSURANCE_COMPANY ||
    orgType === USER_TYPES.INSURANCE_COMPANY_COOPERATIVE ||
    orgType === USER_TYPES.INSURANCE_COMPANY_INSURTECH ||
    orgType === USER_TYPES.INSURANCE_COMPANY_PREPAID_MEDICINE;
  const insuranceCompanies =
    usePublicOrganizationsStore(
      useShallow((state) => state.publicOrganizations?.insuranceCompanies)
    ) || [];
  const paginationInfo = usePublicOrganizationsStore(
    useShallow((state) => state.publicOrganizations?.pagination?.insuranceCompanies)
  );
  const { handleChangePage, isLoadingPublicOrganizations } = usePublicOrganizations({});

  const subtypeByOrgType: Record<string, InsuranceCompanySubtype | null> = {
    [USER_TYPES.INSURANCE_COMPANY]: null,
    [USER_TYPES.INSURANCE_COMPANY_COOPERATIVE]:
      InsuranceCompanySubtype.Cooperatives,
    [USER_TYPES.INSURANCE_COMPANY_INSURTECH]:
      InsuranceCompanySubtype.Insurtech,
    [USER_TYPES.INSURANCE_COMPANY_PREPAID_MEDICINE]:
      InsuranceCompanySubtype.PrepaidMedicine,
  };

  const currentSubtype =
    (orgType && subtypeByOrgType[orgType as string]) ?? null;

  const filteredInsuranceCompanies = currentSubtype
    ? insuranceCompanies.filter(
        (company) => company.subtype === currentSubtype
      )
    : insuranceCompanies;

  const titleByOrgType: Record<string, string> = {
    [USER_TYPES.INSURANCE_COMPANY]: "Compañías de seguros",
    [USER_TYPES.INSURANCE_COMPANY_COOPERATIVE]: "Cooperativas",
    [USER_TYPES.INSURANCE_COMPANY_PREPAID_MEDICINE]: "Medicina prepagada",
    [USER_TYPES.INSURANCE_COMPANY_INSURTECH]: "Insurtech",
  };

  const sectionTitle =
    (orgType && titleByOrgType[orgType as string]) || "Compañías de seguros";

  const showGroupedBySubtype =
    !orgType || orgType === USER_TYPES.INSURANCE_COMPANY;

  const standardCompanies = insuranceCompanies.filter(
    (company) => company.subtype === InsuranceCompanySubtype.Standard
  );
  const cooperativeCompanies = insuranceCompanies.filter(
    (company) => company.subtype === InsuranceCompanySubtype.Cooperatives
  );
  const prepaidMedicineCompanies = insuranceCompanies.filter(
    (company) => company.subtype === InsuranceCompanySubtype.PrepaidMedicine
  );
  const insurtechCompanies = insuranceCompanies.filter(
    (company) => company.subtype === InsuranceCompanySubtype.Insurtech
  );

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
      {!showGroupedBySubtype && (
        <>
          <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
            <h2>{sectionTitle}</h2>
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

          {Boolean(filteredInsuranceCompanies?.length) ? (
            <>
              <CardCarousel className="w-full md:hidden">
                {filteredInsuranceCompanies?.map((item, index) => (
                  <div
                    className="w-full"
                    key={`insurance-company-card-${item?.id}-${index}`}
                  >
                    <InsuranceCompanyCard data={item} />
                  </div>
                ))}
              </CardCarousel>

              <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
                {filteredInsuranceCompanies?.map((item, index) => (
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
        </>
      )}

      {showGroupedBySubtype && (
        <div className="w-full flex flex-col gap-10">
          {/* Compañías de seguros (Standard) */}
          <section className="w-full flex flex-col gap-4">
            <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
              <h2>Compañías de seguros</h2>
            </header>
            {standardCompanies.length ? (
              <>
                <CardCarousel className="w-full md:hidden">
                  {standardCompanies.map((item, index) => (
                    <div
                      className="w-full"
                      key={`insurance-company-standard-${item?.id}-${index}`}
                    >
                      <InsuranceCompanyCard data={item} />
                    </div>
                  ))}
                </CardCarousel>
                <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
                  {standardCompanies.map((item, index) => (
                    <InsuranceCompanyCard
                      data={item}
                      key={`insurance-company-standard-${item?.id}-${index}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty description="No hay compañías de seguros disponibles" />
            )}
          </section>

          {/* Cooperativas */}
          <section className="w-full flex flex-col gap-4">
            <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
              <h2>Cooperativas</h2>
            </header>
            {cooperativeCompanies.length ? (
              <>
                <CardCarousel className="w-full md:hidden">
                  {cooperativeCompanies.map((item, index) => (
                    <div
                      className="w-full"
                      key={`insurance-company-coop-${item?.id}-${index}`}
                    >
                      <InsuranceCompanyCard data={item} />
                    </div>
                  ))}
                </CardCarousel>
                <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
                  {cooperativeCompanies.map((item, index) => (
                    <InsuranceCompanyCard
                      data={item}
                      key={`insurance-company-coop-${item?.id}-${index}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty description="No hay cooperativas disponibles" />
            )}
          </section>

          {/* Medicina prepagada */}
          <section className="w-full flex flex-col gap-4">
            <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
              <h2>Medicina prepagada</h2>
            </header>
            {prepaidMedicineCompanies.length ? (
              <>
                <CardCarousel className="w-full md:hidden">
                  {prepaidMedicineCompanies.map((item, index) => (
                    <div
                      className="w-full"
                      key={`insurance-company-prepaid-${item?.id}-${index}`}
                    >
                      <InsuranceCompanyCard data={item} />
                    </div>
                  ))}
                </CardCarousel>
                <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
                  {prepaidMedicineCompanies.map((item, index) => (
                    <InsuranceCompanyCard
                      data={item}
                      key={`insurance-company-prepaid-${item?.id}-${index}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty description="No hay compañías de medicina prepagada disponibles" />
            )}
          </section>

          {/* Insurtech */}
          <section className="w-full flex flex-col gap-4">
            <header className="w-full pb-2 border-b border-b-blue-200 font-century-gothic text-blue-500 text-lg flex items-center justify-start gap-3">
              <h2>Insurtech</h2>
            </header>
            {insurtechCompanies.length ? (
              <>
                <CardCarousel className="w-full md:hidden">
                  {insurtechCompanies.map((item, index) => (
                    <div
                      className="w-full"
                      key={`insurance-company-insurtech-${item?.id}-${index}`}
                    >
                      <InsuranceCompanyCard data={item} />
                    </div>
                  ))}
                </CardCarousel>
                <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center 2xl::justify-items-start">
                  {insurtechCompanies.map((item, index) => (
                    <InsuranceCompanyCard
                      data={item}
                      key={`insurance-company-insurtech-${item?.id}-${index}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty description="No hay compañías Insurtech disponibles" />
            )}
          </section>
        </div>
      )}
    </section>
  );
};

export default InsuranceCompanies;
