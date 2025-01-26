import { pickBy } from "lodash";
import { ParsedUrlQuery } from "querystring";
import { ORGANIZATION_FILTER_KEYS } from "./constants";

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
    location,
    supplierType,
    minAge,
    maxAge,
    minExperience,
    maxExperience,
  } = query;

  const filterKey =
    ORGANIZATION_FILTER_KEYS[
      query?.type as keyof typeof ORGANIZATION_FILTER_KEYS
    ];

  const ageRange =
    minAge && maxAge ? [Number(minAge), Number(maxAge)] : undefined;

  const experienceRange =
    minExperience && maxExperience
      ? [Number(minExperience), Number(maxExperience)]
      : undefined;

  const currentFilters = pickBy(
    {
      ageRange,
      experienceRange,
      sex: genre,
      name: search,
      lineOfBusiness: segment,
      serviceType: supplierType,
      address: location ? { city: location } : undefined,
    },
    (value) => Boolean(value)
  );

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
    {}
  );

  return generalFilters;
};
