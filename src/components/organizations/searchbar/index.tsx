import React, { useEffect } from "react";
import { cn } from "@/utils/class-name";
import { ORGANIZATION_TYPE_OPTIONS } from "./constants";
import OrganizationTypeButton from "./organization-type-button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@/components/ui/text-input";
import { useRouter } from "next/router";
import { useIsClient } from "@uidotdev/usehooks";
import OrganizationFilters from "./filters";
import { useQuery } from "@apollo/client";
import { ALL_ORGANIZATION_TYPES_QUERY } from "@/lib/sektor-api/queries/public/all-organization-types";
import { getCurrentFiltersFromQuery } from "./helpers";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { usePublicOrganizationsStore } from "@/store/public-organizations";

interface SearchbarProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const Searchbar = ({ className, ...props }: SearchbarProps) => {
  const isClient = useIsClient();
  const { replace, query } = useRouter();
  const currentFilters = getCurrentFiltersFromQuery(query);
  const setPublicBrokerageSocieties = usePublicOrganizationsStore(
    (state) => state.setPublicBrokerageSocieties
  );
  const setPublicExclusiveAgents = usePublicOrganizationsStore(
    (state) => state.setPublicExclusiveAgents
  );
  const setPublicInsuranceBrokers = usePublicOrganizationsStore(
    (state) => state.setPublicInsuranceBrokers
  );
  const setPublicInsuranceCompanies = usePublicOrganizationsStore(
    (state) => state.setPublicInsuranceCompanies
  );
  const setPublicSuppliers = usePublicOrganizationsStore(
    (state) => state.setPublicSuppliers
  );
  const setIsLoadingPublicOrganizations = usePublicOrganizationsStore(
    (state) => state.setIsLoadingPublicOrganizations
  );
  const isLoadingPublicOrganizations = usePublicOrganizationsStore(
    (state) => state.isLoadingPublicOrganizations
  );

  const { refetch: getOrganizations } = useQuery(ALL_ORGANIZATION_TYPES_QUERY, {
    skip: true,
    fetchPolicy: "no-cache",
    variables: {
      pagination: { offset: 0, limit: 6 },
      ...currentFilters,
    },
  });

  const handleGetPublicOrganizations = async () => {
    setIsLoadingPublicOrganizations(true);
    try {
      const organizationsData = await getOrganizations();
      const {
        publicSuppliers = {},
        publicExclusiveAgents = {},
        publicInsuranceBrokers = {},
        publicBrokerageSocieties = {},
        publicInsuranceCompanies = {},
      } = organizationsData?.data;
      setPublicSuppliers(publicSuppliers?.items);
      setPublicExclusiveAgents(publicExclusiveAgents?.items);
      setPublicInsuranceBrokers(publicInsuranceBrokers?.items);
      setPublicBrokerageSocieties(publicBrokerageSocieties?.items);
      setPublicInsuranceCompanies(publicInsuranceCompanies?.items);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    } finally {
      setIsLoadingPublicOrganizations(false);
    }
  };

  useEffect(() => {
    handleGetPublicOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.type]);

  return (
    <section
      className={cn(
        "w-full flex flex-col-reverse items-center justify-between gap-8 max-w-md mb-2 mx-auto md:flex-row md:max-w-full md:mb-4",
        className
      )}
      {...props}
    >
      <div className="flex gap-4 w-fit">
        {ORGANIZATION_TYPE_OPTIONS.map((option) => {
          return (
            <OrganizationTypeButton
              data={option}
              key={`organization-type-button-${option.id}`}
            />
          );
        })}
      </div>

      <div className="w-full flex items-center justify-between gap-4 lg:gap-8">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleGetPublicOrganizations();
          }}
        >
          <TextInput
            iconPosition="end"
            icon={faMagnifyingGlass}
            disabled={isLoadingPublicOrganizations}
            iconProps={{ className: "opacity-40" }}
            wrapperClassName="w-full relative"
            className="rounded-3xl border-opacity-50 md:text-lg shadow-xl placeholder:text-gray-400"
            placeholder="Busca intermediario, seguros o ramos"
            value={(query?.search as string) || ""}
            onChange={(e) => {
              replace(
                { query: { ...query, search: e?.target?.value } },
                undefined,
                { scroll: false }
              );
            }}
          />
        </form>
        {isClient && <OrganizationFilters />}
      </div>
    </section>
  );
};

export default Searchbar;
