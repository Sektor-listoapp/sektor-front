import {
  ALLOWED_FILTERS_BY_USER_TYPE,
  ORGANIZATION_FILTER_FIELD_NAMES,
} from "./constants";

const { AGE_RANGE, EXPERIENCE_RANGE } = ORGANIZATION_FILTER_FIELD_NAMES;

export const checkAllowedFilter = (userType: string, filterType: string) => {
  const allowedFilters =
    ALLOWED_FILTERS_BY_USER_TYPE[
      userType as keyof typeof ALLOWED_FILTERS_BY_USER_TYPE
    ];
  return allowedFilters?.includes(filterType);
};

export const getRangeQueries = ({
  ageRange,
  experienceRange,
  organizationType,
}: {
  ageRange: number[];
  experienceRange: number[];
  organizationType: string;
}) => {
  const [minAge, maxAge] = ageRange;
  const [minExperience, maxExperience] = experienceRange;

  const ageRangeQuery = checkAllowedFilter(organizationType, AGE_RANGE)
    ? { minAge, maxAge }
    : {};
  const experienceRangeQuery = checkAllowedFilter(
    organizationType,
    EXPERIENCE_RANGE
  )
    ? { minExperience, maxExperience }
    : {};

  return { ...ageRangeQuery, ...experienceRangeQuery };
};
