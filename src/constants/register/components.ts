import dynamic from "next/dynamic";

export const REGISTER_COMPONENTS = {
  USER_TYPES: "UserTypes",
  COMPANY_TYPES: "CompanyTypes",
  COMPANY_SEGMENTS: "CompanySegments",
  CUSTOMER_FORM: "CustomerForm",
  EXCLUSIVE_AGENT_FORM: "ExclusiveAgentForm",
  BROKERAGE_SOCIETY_FORM: "BrokerageSocietyForm",
  INSURANCE_BROKER_FORM: "InsuranceBrokerForm",
  INSURANCE_COMPANY_FORM: "InsuranceCompanyForm",
  SUPPLIER_FORM: "SupplierForm",
  SENT_EMAIL_VERIFICATION: "SentEmailVerification",
  EMAIL_VERIFICATION_SUCCESS: "EmailVerificationSuccess",
  DATA_SENT_TO_CONFIRM: "DataSentToConfirm",
} as const;

export const REGISTER_COMPONENTS_MAP = {
  UserTypes: dynamic(() => import("@/components/auth/register/user-types")),
  CompanyTypes: dynamic(
    () => import("@/components/auth/register/company-types")
  ),
  CompanySegments: dynamic(
    () => import("@/components/auth/register/company-segments")
  ),
  CustomerForm: dynamic(
    () => import("@/components/auth/register/customer-form")
  ),
  ExclusiveAgentForm: dynamic(
    () => import("@/components/auth/register/exclusive-agent-form")
  ),
  BrokerageSocietyForm: dynamic(
    () => import("@/components/auth/register/brokerage-society-form")
  ),
  InsuranceBrokerForm: dynamic(
    () => import("@/components/auth/register/insurance-broker-form")
  ),
  InsuranceCompanyForm: dynamic(
    () => import("@/components/auth/register/insurance-company-form")
  ),
  SupplierForm: dynamic(
    () => import("@/components/auth/register/supplier-form")
  ),
  SentEmailVerification: dynamic(
    () => import("@/components/auth/register/sent-email-verification")
  ),
  EmailVerificationSuccess: dynamic(
    () => import("@/components/auth/register/email-verification-success")
  ),
  DataSentToConfirm: dynamic(
    () => import("@/components/auth/register/data-sent-to-confirm")
  ),
} as const;
