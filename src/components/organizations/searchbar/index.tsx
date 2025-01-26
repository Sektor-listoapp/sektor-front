import React, { useEffect, useState } from "react";
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

interface SearchbarProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const Searchbar = ({ className, ...props }: SearchbarProps) => {
  const isClient = useIsClient();
  const { replace, query } = useRouter();
  const currentFilters = getCurrentFiltersFromQuery(query);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);

  const { refetch: getOrganizations } = useQuery(ALL_ORGANIZATION_TYPES_QUERY, {
    skip: true,
    fetchPolicy: "no-cache",
    variables: {
      pagination: { offset: 0, limit: 6 },
      ...currentFilters,
    },
  });

  const handleGetOrganizations = async () => {
    console.log("Getting organizations");
    setIsLoadingOrganizations(true);
    try {
      const organizationsData = await getOrganizations();
      console.log("Organizations data", organizationsData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      console.error("Error getting organizations", error);
      toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    } finally {
      setIsLoadingOrganizations(false);
    }
  };

  useEffect(() => {
    handleGetOrganizations();
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

      {isLoadingOrganizations && (
        <div className="w-full flex items-center justify-center">
          <h1 className="text-blue-500 text-4xl">Cargando...</h1>
        </div>
      )}

      <div className="w-full flex items-center justify-between gap-4 lg:gap-8">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query?.search) return;
            handleGetOrganizations();
          }}
        >
          <TextInput
            iconPosition="end"
            icon={faMagnifyingGlass}
            disabled={isLoadingOrganizations}
            iconProps={{ className: "opacity-40" }}
            wrapperClassName="w-full relative"
            className="rounded-3xl border-opacity-50 md:text-lg shadow-xl placeholder:text-gray-400"
            placeholder="Busca intermediario, seguros o ramos"
            value={(query?.search as string) || ""}
            onChange={(e) => {
              replace({ query: { ...query, search: e?.target?.value } });
            }}
          />
        </form>
        {isClient && <OrganizationFilters />}
      </div>
    </section>
  );
};

export default Searchbar;
