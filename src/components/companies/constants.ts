export const COMPANY_SORT_OPTIONS = {
  name: "name",
  createdAt: "createdAt",
} as const;

export type CompanySortOption =
  (typeof COMPANY_SORT_OPTIONS)[keyof typeof COMPANY_SORT_OPTIONS];
