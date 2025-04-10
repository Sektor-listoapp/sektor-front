import { OrganizationLineOfBusiness } from "@/lib/sektor-api/__generated__/types";
import dynamic from "next/dynamic";

const { Auto, Health, Property } = OrganizationLineOfBusiness;

export const QUOTE_FORM_MAP = {
  [Auto]: dynamic(() => import("./auto-quote-form")),
  [Health]: dynamic(() => import("./health-quote-form")),
  [Property]: dynamic(() => import("./property-quote-form")),
  Others: dynamic(() => import("./other-quote-form")),
  default: dynamic(() => import("./user-info-form")),
} as const;
