import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/button";
import Range from "@/components/ui/range";
import Select from "@/components/ui/select";
import { SELECT_LINE_OF_BUSINESS_OPTIONS } from "@/constants/forms";
import { useQuery } from "@apollo/client";
import { Query } from "@/lib/sektor-api/__generated__/graphql";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries/public/country-by-code";
import { getLocationOptions } from "@/utils/organizations";
import usePublicOrganizations from "@/hooks/use-public-organizations";

const BrokerageSocietyFilters = () => {
  const { query, replace } = useRouter();
  const { data: countryData, loading: isLoadingCountryData } = useQuery<Query>(
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
    minExperience = 10,
    maxExperience = 30,
  } = query;

  const [filters, setFilters] = React.useState({
    segment: (segment as string) || SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
    experienceRange: [Number(minExperience), Number(maxExperience)],
  });

  useEffect(() => {
    setFilters({
      segment: (segment as string) || SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
      experienceRange: [Number(minExperience), Number(maxExperience)],
    });
  }, [segment, minExperience, maxExperience]);

  const handleApplyFilters = () => {
    const [minExperienceValue, maxExperienceValue] = filters.experienceRange;

    const newQuery: Record<string, string | number | string[] | undefined> = { ...query };

    if (filters.segment && filters.segment !== SELECT_LINE_OF_BUSINESS_OPTIONS[0].value) {
      newQuery.segment = filters.segment;
    } else {
      delete newQuery.segment;
    }

    const hasExperienceInQuery = 'minExperience' in query || 'maxExperience' in query;
    if (hasExperienceInQuery) {
      newQuery.minExperience = minExperienceValue;
      newQuery.maxExperience = maxExperienceValue;
    } else {
      delete newQuery.minExperience;
      delete newQuery.maxExperience;
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

      <Range
        label="Experiencia"
        min={0}
        max={50}
        defaultValue={filters.experienceRange}
        value={filters.experienceRange}
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, experienceRange: value }))
        }
        minRangeLabel={`${filters.experienceRange[0]} ${filters.experienceRange[0] === 1 ? "año" : "años"
          }`}
        maxRangeLabel={`${filters.experienceRange[1]} años`}
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

export default BrokerageSocietyFilters;
