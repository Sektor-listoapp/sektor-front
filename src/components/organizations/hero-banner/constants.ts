import { USER_TYPES } from "@/constants/shared";
import DefaultHeroBannerContent from "../default-hero-banner-content";

const {
  INSURANCE_COMPANY,
  INSURANCE_COMPANY_COOPERATIVE,
  INSURANCE_COMPANY_INSURTECH,
  INSURANCE_COMPANY_PREPAID_MEDICINE,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  INSURANCE_BROKER,
  SUPPLIER,
} = USER_TYPES;

export const HERO_BANNER_CONTENT = {
  [BROKERAGE_SOCIETY]: DefaultHeroBannerContent,
  [EXCLUSIVE_AGENT]: DefaultHeroBannerContent,
  [INSURANCE_BROKER]: DefaultHeroBannerContent,
  [INSURANCE_COMPANY]: DefaultHeroBannerContent,
  [INSURANCE_COMPANY_COOPERATIVE]: DefaultHeroBannerContent,
  [INSURANCE_COMPANY_INSURTECH]: DefaultHeroBannerContent,
  [INSURANCE_COMPANY_PREPAID_MEDICINE]: DefaultHeroBannerContent,
  [SUPPLIER]: DefaultHeroBannerContent,
  DEFAULT: DefaultHeroBannerContent,
} as const;
