import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/button";
import Range from "@/components/ui/range";
import Select from "@/components/ui/select";
import {
  SELECT_GENRE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
} from "@/constants/forms";
import usePublicOrganizations from "@/hooks/use-public-organizations";

const DefaultOrganizationFilters = () => {
  const { query, replace } = useRouter();

  const {
    handleGetPublicOrganizations,
    isLoadingPublicOrganizations,
  } = usePublicOrganizations({});

  const {
    genre = "",
    segment = "",
    minAge = 25,
    maxAge = 55,
    minExperience = 10,
    maxExperience = 30,
  } = query;

  const [filters, setFilters] = React.useState({
    segment: (segment as string) || SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
    ageRange: [Number(minAge), Number(maxAge)],
    experienceRange: [Number(minExperience), Number(maxExperience)],
    genre: (genre as string) || SELECT_GENRE_OPTIONS[0].value,
  });

  useEffect(() => {
    setFilters({
      segment: (segment as string) || SELECT_LINE_OF_BUSINESS_OPTIONS[0].value,
      ageRange: [Number(minAge), Number(maxAge)],
      experienceRange: [Number(minExperience), Number(maxExperience)],
      genre: (genre as string) || SELECT_GENRE_OPTIONS[0].value,
    });
  }, [segment, minAge, maxAge, minExperience, maxExperience, genre]);

  const handleApplyFilters = () => {
    const [minAgeValue, maxAgeValue] = filters.ageRange;
    const [minExperienceValue, maxExperienceValue] = filters.experienceRange;

    const newQuery: Record<string, string | number | string[] | undefined> = { ...query };

    if (filters.segment && filters.segment !== SELECT_LINE_OF_BUSINESS_OPTIONS[0].value) {
      newQuery.segment = filters.segment;
    } else {
      delete newQuery.segment;
    }

    if (filters.genre && filters.genre !== SELECT_GENRE_OPTIONS[0].value) {
      newQuery.genre = filters.genre;
    } else {
      delete newQuery.genre;
    }

    const hasAgeInQuery = 'minAge' in query || 'maxAge' in query;
    if (hasAgeInQuery) {
      newQuery.minAge = minAgeValue;
      newQuery.maxAge = maxAgeValue;
    } else {
      delete newQuery.minAge;
      delete newQuery.maxAge;
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
        minRangeLabel={`${filters.experienceRange[0]} ${filters.experienceRange[0] === 1 ? "año" : "años"
          }`}
        maxRangeLabel={`${filters.experienceRange[1]} años`}
      />

      <Range
        label="Edad"
        min={0}
        max={70}
        defaultValue={filters.ageRange}
        value={filters.ageRange}
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, ageRange: value }))
        }
        minRangeLabel={`${filters.ageRange[0]} años`}
        maxRangeLabel={`${filters.ageRange[1]} años`}
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

export default DefaultOrganizationFilters;
