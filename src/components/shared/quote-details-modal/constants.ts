import { QuoteLineOfBusiness } from "@/lib/sektor-api/__generated__/types";
import dynamic from "next/dynamic";

const { Auto, Health, Other, Property } = QuoteLineOfBusiness;

export const QUOTE_DETAILS_CONTENT_MAP = {
  [Auto]: dynamic(() => import("./auto")),
  [Other]: dynamic(() => import("./other")),
  [Health]: dynamic(() => import("./health")),
  [Property]: dynamic(() => import("./property")),
} as const;
