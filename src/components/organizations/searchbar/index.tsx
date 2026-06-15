import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/utils/class-name";
import { ORGANIZATION_TYPE_OPTIONS } from "./constants";
import OrganizationTypeButton from "./organization-type-button";
import { useRouter } from "next/router";
import { useIsClient } from "@uidotdev/usehooks";
import OrganizationFilters from "./filters";
import usePublicOrganizations from "@/hooks/use-public-organizations";
import Button from "@/components/ui/button";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import OrganizationSearchField from "./organization-search-field";

const FILTER_QUERY_KEYS = [
  "genre",
  "segment",
  "city",
  "state",
  "serviceType",
  "insuranceCompanyId",
  "minAge",
  "maxAge",
  "minExperience",
  "maxExperience",
] as const;

const hasActiveFilters = (query: ParsedUrlQuery) =>
  FILTER_QUERY_KEYS.some(
    (key) =>
      query[key] !== undefined && query[key] !== null && query[key] !== ""
  );

const Searchbar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isClient = useIsClient();
  const { replace, query, isReady } = useRouter();
  const {
    handleGetPublicOrganizations,
    handleGetPublicOrganizationsWithNewFilters,
    handleGetPublicOrganizationsWithoutFilters,
  } = usePublicOrganizations({});
  const isInitialMount = useRef(true);
  const lastTypeRef = useRef(query?.type);
  const hasLoadedInitialData = useRef(false);
  const queryRef = useRef(query);

  queryRef.current = query;

  const runSearch = useCallback(
    (searchTerm: string) => {
      const currentQuery = queryRef.current;
      const trimmedSearch = searchTerm.trim();
      const nextQuery: ParsedUrlQuery = { ...currentQuery };

      if (trimmedSearch) {
        nextQuery.search = trimmedSearch;
      } else {
        delete nextQuery.search;
      }

      replace({ query: nextQuery }, undefined, { scroll: false });

      if (nextQuery.type || hasActiveFilters(nextQuery) || trimmedSearch) {
        handleGetPublicOrganizationsWithNewFilters(nextQuery, 12, 1);
        return;
      }

      handleGetPublicOrganizationsWithoutFilters();
    },
    [
      replace,
      handleGetPublicOrganizationsWithNewFilters,
      handleGetPublicOrganizationsWithoutFilters,
    ]
  );

  const handleSearch = useCallback(
    (value: string) => {
      runSearch(value);
    },
    [runSearch]
  );

  const handleClearSearch = useCallback(() => {
    runSearch("");
  }, [runSearch]);

  useEffect(() => {
    if (!isReady) return;

    const hasFilters = hasActiveFilters(query);

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

  const urlSearch = (query?.search as string) || "";

  return (
    <section
      className={cn(
        "w-full flex flex-col items-center justify-between gap-6 mb-2 mx-auto md:flex-row md:mb-4",
        className
      )}
      {...props}
    >
      <Link href="/clinic-list" className="w-full md:hidden">
        <Button className="w-full">
          Ver listado de clínicas y seguros disponibles
        </Button>
      </Link>
      <div className="w-full flex justify-center md:justify-start md:w-auto overflow-x-auto md:overflow-visible">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 w-full max-w-full min-w-0 md:w-auto">
          {ORGANIZATION_TYPE_OPTIONS.map((option) => (
            <OrganizationTypeButton
              data={option}
              key={`organization-type-button-${option.id}`}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-4 lg:gap-8 md:flex-1">
        <OrganizationSearchField
          urlSearch={urlSearch}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
        {isClient && <OrganizationFilters />}
      </div>
    </section>
  );
};

export default Searchbar;
