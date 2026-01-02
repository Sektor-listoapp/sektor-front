import { pickBy } from "lodash";
import { ParsedUrlQuery } from "querystring";
import { ORGANIZATION_FILTER_KEYS } from "@/constants/organizations";

const buildFiltersForType = (
  organizationType: string,
  baseFilters: Record<string, unknown>,
  stateNumber: number | undefined,
  cityNumber: number | undefined
) => {
  const filters = { ...baseFilters };

  if (organizationType === "Supplier") {
    if (stateNumber !== undefined) {
      filters.stateId = stateNumber;
    }
    if (cityNumber !== undefined) {
      filters.address = { city: cityNumber };
    }
  } else {
    const addressFilter: { city?: number; state?: number } = {};
    if (stateNumber !== undefined) {
      addressFilter.state = stateNumber;
    }
    if (cityNumber !== undefined) {
      addressFilter.city = cityNumber;
    }
    if (Object.keys(addressFilter).length > 0) {
      filters.address = addressFilter;
    }
  }

  return filters;
};

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
    state,
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
    if (!isNaN(minExpNum) && !isNaN(maxExpNum) && minExpNum >= 0 && maxExpNum >= 0 && minExpNum <= maxExpNum) {
      experienceRange = [minExpNum, maxExpNum];
    }
  }

  let stateNumber: number | undefined = undefined;
  if (state && state !== "") {
    const num = Number(state);
    if (!isNaN(num) && isFinite(num) && num >= 0 && Number.isInteger(num)) {
      stateNumber = num;
    }
  }

  let cityNumber: number | undefined = undefined;
  if (city && city !== "") {
    const num = Number(city);
    if (!isNaN(num) && isFinite(num) && num >= 0 && Number.isInteger(num)) {
      cityNumber = num;
    }
  }

  const baseFilters = pickBy(
    {
      ageRange,
      experienceRange,
      sex: genre && genre !== "" ? genre : undefined,
      name: search && search !== "" ? search : undefined,
      lineOfBusiness: segment && segment !== "" ? segment : undefined,
      serviceType: serviceType && serviceType !== "" ? serviceType : undefined,
    },
    (value) => value !== undefined && value !== null && value !== ""
  );

  const hasValidFilters = Object.keys(baseFilters).length > 0 || stateNumber !== undefined || cityNumber !== undefined;

  if (!hasValidFilters) {
    return {};
  }

  if (isOrganizationTypeSelected && filterKey) {
    const filters = buildFiltersForType(
      query?.type as string,
      baseFilters,
      stateNumber,
      cityNumber
    );
    return {
      [filterKey]: filters,
    };
  }

  const generalFilters = Object.keys(ORGANIZATION_FILTER_KEYS).reduce(
    (acc, key) => {
      const filterKey =
        ORGANIZATION_FILTER_KEYS[key as keyof typeof ORGANIZATION_FILTER_KEYS];
      const filters = buildFiltersForType(key, baseFilters, stateNumber, cityNumber);
      return {
        ...acc,
        [filterKey]: filters,
      };
    },
    {} as Record<string, Record<string, unknown>>
  );

  return generalFilters;
};
