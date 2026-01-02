import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/class-name";
import { ORGANIZATION_TYPE_OPTIONS } from "./constants";
import OrganizationTypeButton from "./organization-type-button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@/components/ui/text-input";
import { useRouter } from "next/router";
import { useIsClient } from "@uidotdev/usehooks";
import OrganizationFilters from "./filters";
import usePublicOrganizations from "@/hooks/use-public-organizations";

const Searchbar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isClient = useIsClient();
  const { replace, query, isReady } = useRouter();
  const {
    handleGetPublicOrganizations,
    isLoadingPublicOrganizations,
    handleGetPublicOrganizationsWithNewFilters,
  } = usePublicOrganizations({});
  const isInitialMount = useRef(true);
  const lastTypeRef = useRef(query?.type);
  const hasLoadedInitialData = useRef(false);

  useEffect(() => {
    if (!isReady) return;

    const filterKeys = [
      'genre',
      'segment',
      'city',
      'state',
      'serviceType',
      'minAge',
      'maxAge',
      'minExperience',
      'maxExperience',
    ];

    const hasFilters = filterKeys.some(
      (key) => query[key] !== undefined && query[key] !== null && query[key] !== ''
    );

    if (isInitialMount.current && !hasLoadedInitialData.current) {
      isInitialMount.current = false;
      hasLoadedInitialData.current = true;
      lastTypeRef.current = query?.type;
      if (query?.type || hasFilters) {
        handleGetPublicOrganizationsWithNewFilters(query, 12, 1);
      } else {
        handleGetPublicOrganizations();
      }
      return;
    }

    if (lastTypeRef.current !== query?.type) {
      lastTypeRef.current = query?.type;
      if (query?.type || hasFilters) {
        handleGetPublicOrganizationsWithNewFilters(query, 12, 1);
      } else {
        handleGetPublicOrganizations();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.type, isReady]);

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
          className="w-full flex items-center gap-3"
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
