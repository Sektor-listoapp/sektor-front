import { USER_FORM } from "@/components/my-account/constants";
import { OrganizationType, UserGroups } from "@/lib/sektor-api/__generated__/types";

export function getUserForm(group: UserGroups | null | undefined, organization?: OrganizationType) {
  if (group === UserGroups.Customer) {
    return USER_FORM[UserGroups.Customer];
  }

  const form = USER_FORM[organization?.type || ""];

  return form ?? null;
}