import React from "react";
import Range from "@/components/ui/range";
import Select from "@/components/ui/select";
import { SELECT_LINE_OF_BUSINESS_OPTIONS } from "@/constants/forms";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";
import { Query } from "@/lib/sektor-api/__generated__/graphql";
import { useQuery } from "@apollo/client";
import { getLocationOptions } from "@/utils/organizations";

const InsuranceCompanyFilters = () => {
  const { data: countryData, loading: isLoadingCountryData } = useQuery<Query>(
    COUNTRY_BY_CODE_QUERY,
    { variables: { code: "VE" } }
  );
  const locationOptions = getLocationOptions(countryData?.getCountryByCode);

  const [filters, setFilters] = React.useState({
    location: locationOptions[0].value,
    segment: SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
    experienceRange: [10, 30],
  });

  return (
    <section className="w-full flex flex-col gap-6 items-center justify-center">
      <Select
        name="location"
        wrapperClassName="w-full"
        options={locationOptions}
        disabled={isLoadingCountryData}
        value={filters.location}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, location: e.target.value }))
        }
        defaultValue={locationOptions[0].value}
      />

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
        minRangeLabel={`${filters.experienceRange[0]} ${
          filters.experienceRange[0] === 1 ? "año" : "años"
        }`}
        maxRangeLabel={`${filters.experienceRange[1]} años`}
      />
    </section>
  );
};

export default InsuranceCompanyFilters;
