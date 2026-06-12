import { USER_FORM } from "@/components/my-account/constants";
import {
  CustomerType,
  OrganizationType,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";

export function getUserForm(
  entity?: OrganizationType | CustomerType | null
) {
  if (!entity) return null;

  if ("group" in entity && entity.group === UserGroups.Customer) {
    return USER_FORM[UserGroups.Customer];
  }

  if ("type" in entity) {
    const form = USER_FORM[entity.type || ""];
    return form ?? null;
  }

  return null;
}
