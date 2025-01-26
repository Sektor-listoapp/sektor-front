import { USER_TYPES } from "@/constants/shared";
import InsuranceCompanyHeroBannerContent from "../insurance-company-hero-banner-content";
import DefaultHeroBannerContent from "../default-hero-banner-content";
import SupplierHeroBannerContent from "../suppliers-hero-banner-content";

const {
  INSURANCE_COMPANY,
  BROKERAGE_SOCIETY,
  EXCLUSIVE_AGENT,
  INSURANCE_BROKER,
  SUPPLIER,
} = USER_TYPES;

export const HERO_BANNER_CONTENT = {
  [BROKERAGE_SOCIETY]: DefaultHeroBannerContent,
  [EXCLUSIVE_AGENT]: DefaultHeroBannerContent,
  [INSURANCE_BROKER]: DefaultHeroBannerContent,
  [INSURANCE_COMPANY]: InsuranceCompanyHeroBannerContent,
  [SUPPLIER]: SupplierHeroBannerContent,
  DEFAULT: DefaultHeroBannerContent,
} as const;
