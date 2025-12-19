import { pickBy } from "lodash";
import { ParsedUrlQuery } from "querystring";
import { ORGANIZATION_FILTER_KEYS } from "@/constants/organizations";

export const getCurrentFiltersFromQuery = (query: ParsedUrlQuery) => {
  const hasQueries =
    Object.keys(query).length > 0 && Object.values(query).some(Boolean);

  if (!hasQueries || !query) {
    return {};
  }

  const isOrganizationTypeSelected = Boolean(query?.type);
  const {
    genre,
    search,
    segment,
    city,
    serviceType,
    minAge,
    maxAge,
    minExperience,
    maxExperience,
  } = query;

  const filterKey =
    ORGANIZATION_FILTER_KEYS[
    query?.type as keyof typeof ORGANIZATION_FILTER_KEYS
    ];


  const hasAgeFilter = 'minAge' in query || 'maxAge' in query;
  let ageRange: [number, number] | undefined = undefined;
  if (
    hasAgeFilter &&
    minAge !== undefined &&
    maxAge !== undefined &&
    minAge !== "" &&
    maxAge !== ""
  ) {
    const minAgeNum = Number(minAge);
    const maxAgeNum = Number(maxAge);
    if (!isNaN(minAgeNum) && !isNaN(maxAgeNum) && minAgeNum >= 0 && maxAgeNum >= 0) {
      ageRange = [minAgeNum, maxAgeNum];
    }
  }

  const hasExperienceFilter = 'minExperience' in query || 'maxExperience' in query;
  let experienceRange: [number, number] | undefined = undefined;
  if (
    hasExperienceFilter &&
    minExperience !== undefined &&
    maxExperience !== undefined &&
    minExperience !== "" &&
    maxExperience !== ""
  ) {
    const minExpNum = Number(minExperience);
    const maxExpNum = Number(maxExperience);
    if (!isNaN(minExpNum) && !isNaN(maxExpNum) && minExpNum >= 0 && maxExpNum >= 0) {
      experienceRange = [minExpNum, maxExpNum];
    }
  }

  let cityFilter: { city: number } | undefined = undefined;
  if (city && city !== "") {
    const cityNumber = Number(city);
    if (!isNaN(cityNumber) && isFinite(cityNumber) && cityNumber >= 0 && Number.isInteger(cityNumber)) {
      cityFilter = { city: cityNumber };
    }
  }

  const currentFilters = pickBy(
    {
      ageRange,
      experienceRange,
      sex: genre && genre !== "" ? genre : undefined,
      name: search && search !== "" ? search : undefined,
      lineOfBusiness: segment && segment !== "" ? segment : undefined,
      serviceType: serviceType && serviceType !== "" ? serviceType : undefined,
      address: cityFilter,
    },
    (value) => value !== undefined && value !== null && value !== ""
  );

  const hasValidFilters = Object.keys(currentFilters).length > 0;

  if (!hasValidFilters) {
    return {};
  }

  if (isOrganizationTypeSelected && filterKey) {
    return {
      [filterKey]: { ...currentFilters },
    };
  }

  const generalFilters = Object.keys(ORGANIZATION_FILTER_KEYS).reduce(
    (acc, key) => {
      const filterKey =
        ORGANIZATION_FILTER_KEYS[key as keyof typeof ORGANIZATION_FILTER_KEYS];
      return {
        ...acc,
        [filterKey]: { ...currentFilters },
      };
    },
    {} as Record<string, typeof currentFilters>
  );

  return generalFilters;
};
