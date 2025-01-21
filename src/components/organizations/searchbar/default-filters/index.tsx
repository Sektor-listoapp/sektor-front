import React from "react";
import Button from "@/components/ui/button";
import Range from "@/components/ui/range";
import Select from "@/components/ui/select";
import {
  SELECT_GENRE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
  SELECT_LOCATION_OPTIONS,
} from "@/constants/forms";

const DefaultOrganizationFilters = () => {
  const [filters, setFilters] = React.useState({
    location: SELECT_LOCATION_OPTIONS[0].value,
    segment: SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
    ageRange: [25, 55],
    experienceRange: [10, 30],
    genre: SELECT_GENRE_OPTIONS[0].value,
  });

  return (
    <section className="w-full flex flex-col gap-6 items-center justify-center">
      <Select
        name="location"
        wrapperClassName="w-full"
        options={SELECT_LOCATION_OPTIONS}
        value={filters.location}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, location: e.target.value }))
        }
        defaultValue={SELECT_LOCATION_OPTIONS[0].value}
      />

      <Select
        name="segment"
        wrapperClassName="w-full"
        options={SELECT_LINE_OF_BUSINESS_OPTIONS}
        value={filters.segment}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, segment: e.target.value }))
        }
        defaultValue={SELECT_GENRE_OPTIONS[0].value}
      />

      <Select
        name="sex"
        wrapperClassName="w-full"
        options={SELECT_GENRE_OPTIONS}
        value={filters.genre}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, genre: e.target.value }))
        }
        defaultValue={SELECT_GENRE_OPTIONS[0].value}
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

      <Range
        label="Edad"
        max={70}
        defaultValue={filters.ageRange}
        value={filters.ageRange}
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, ageRange: value }))
        }
        minRangeLabel={`${filters.ageRange[0]} años`}
        maxRangeLabel={`${filters.ageRange[1]} años`}
      />

      <Button variant="solid-blue" className="w-full">
        Aplicar filtros
      </Button>
    </section>
  );
};

export default DefaultOrganizationFilters;
