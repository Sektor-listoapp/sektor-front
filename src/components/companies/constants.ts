export const CUSTOMER_SORT_OPTIONS = {
  name: "name",
  createdAt: "createdAt",
} as const;

export type CustomerSortOption =
  (typeof CUSTOMER_SORT_OPTIONS)[keyof typeof CUSTOMER_SORT_OPTIONS];
