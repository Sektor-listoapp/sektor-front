import { USER_FORM } from "@/components/my-account/constants";
import { OrganizationType } from "@/lib/sektor-api/__generated__/types";

export function getUserForm(organization?: OrganizationType) {
  const form = USER_FORM[organization?.type || ""];
  return form ?? null;
}