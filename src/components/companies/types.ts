import {
  OrganizationPlans,
  OrganizationType,
  OrganizationTypes,
  CustomerType,
  SurveyTargetCandidateType,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";

export type AdminCompanyListItem = {
  id: string;
  name: string;
  email?: string | null;
  type: OrganizationTypes | typeof UserGroups.Customer;
  isCustomer: boolean;
  clicks?: number | null;
  createdAt?: string | null;
  isActive?: boolean;
  plan?: OrganizationPlans;
  coverageStates?: number[] | null;
};

export type DeleteCompanyTarget = {
  id: string;
  isCustomer: boolean;
};

export const mapOrganizationToListItem = (
  organization: OrganizationType
): AdminCompanyListItem => ({
  id: organization.id,
  name: organization.name,
  email: organization.email,
  type: organization.type,
  isCustomer: false,
  clicks: organization.clicks,
  createdAt: organization.createdAt,
  isActive: organization.isActive,
  plan: organization.plan,
  coverageStates: organization.coverageStates,
});

export const mapCustomerToListItem = (
  customer: CustomerType
): AdminCompanyListItem => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  type: UserGroups.Customer,
  isCustomer: true,
  isActive: Boolean(customer.verifiedAt),
  createdAt: customer.verifiedAt ?? undefined,
});

export const mapSurveyTargetCandidateToListItem = (
  candidate: SurveyTargetCandidateType,
  customer?: CustomerType | null
): AdminCompanyListItem => ({
  id: candidate.id,
  name: candidate.name,
  email: candidate.email,
  type: UserGroups.Customer,
  isCustomer: true,
  isActive: Boolean(customer?.verifiedAt),
  createdAt: customer?.verifiedAt ?? undefined,
});

export const sortCustomerListItems = (
  items: AdminCompanyListItem[],
  sort: "name" | "createdAt"
): AdminCompanyListItem[] => {
  const sorted = [...items];

  if (sort === "name") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
  }

  return sorted.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
};
