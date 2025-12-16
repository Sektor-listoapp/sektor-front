import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { SELECT_LINE_OF_BUSINESS_OPTIONS } from "@/constants/forms";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";
import { Query } from "@/lib/sektor-api/__generated__/graphql";
import { useQuery } from "@apollo/client";
import { getLocationOptions } from "@/utils/organizations";
import usePublicOrganizations from "@/hooks/use-public-organizations";

const InsuranceCompanyFilters = () => {
  const { query, replace } = useRouter();
  const { data: countryData, } = useQuery<Query>(
    COUNTRY_BY_CODE_QUERY,
    { variables: { code: "VE" } }
  );
  const locationOptions = getLocationOptions(countryData?.getCountryByCode);

  const {
    handleGetPublicOrganizations,
    isLoadingPublicOrganizations,
  } = usePublicOrganizations({});

  const {
    segment = "",
  } = query;

  const [filters, setFilters] = React.useState({
    segment: (segment as string) || SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
  });

  useEffect(() => {
    setFilters({
      segment: (segment as string) || SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
    });
  }, [segment]);

  const handleApplyFilters = () => {
    const newQuery: Record<string, string | number | string[] | undefined> = { ...query };

    if (filters.segment && filters.segment !== SELECT_LINE_OF_BUSINESS_OPTIONS[0].value) {
      newQuery.segment = filters.segment;
    } else {
      delete newQuery.segment;
    }

    replace(
      { query: newQuery },
      undefined,
      { scroll: false }
    );

    handleGetPublicOrganizations();
  };

  return (
    <section className="w-full flex flex-col gap-6 items-center justify-center">
      <Select
        name="segment"
        wrapperClassName="w-full"
        options={SELECT_LINE_OF_BUSINESS_OPTIONS}
        value={filters.segment}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, segment: e.target.value }))
        }
        defaultValue={SELECT_LINE_OF_BUSINESS_OPTIONS[0].value}
      />

      <Button
        variant="solid-blue"
        className="w-full"
        disabled={isLoadingPublicOrganizations}
        onClick={handleApplyFilters}
      >
        Aplicar filtros
      </Button>
    </section>
  );
};

export default InsuranceCompanyFilters;
