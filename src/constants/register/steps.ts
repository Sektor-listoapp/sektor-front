import { RegisterStep } from "@/types/register";
import { USER_TYPES } from "../shared";
import { REGISTER_COMPONENTS_MAP, REGISTER_COMPONENTS } from "./components";

const {
  CUSTOMER,
  INSURANCE_BROKER,
  EXCLUSIVE_AGENT,
  BROKERAGE_SOCIETY,
  INSURANCE_COMPANY,
  INSURANCE_COMPANY_COOPERATIVE,
  SUPPLIER,
} = USER_TYPES;

const {
  CUSTOMER_FORM,
  COMPANY_TYPES,
  INSURANCE_BROKER_FORM,
  INSURANCE_COMPANY_FORM,
  SUPPLIER_FORM,
  SENT_EMAIL_VERIFICATION,
  EXCLUSIVE_AGENT_FORM,
  BROKERAGE_SOCIETY_FORM,
  EMAIL_VERIFICATION_SUCCESS,
  DATA_SENT_TO_CONFIRM,
} = REGISTER_COMPONENTS;

export const REGISTER_STEPS: Record<
  keyof typeof REGISTER_COMPONENTS_MAP,
  RegisterStep
> = {
  UserTypes: {
    index: 0,
    component: REGISTER_COMPONENTS.USER_TYPES,
    nextStep: {
      [CUSTOMER]: CUSTOMER_FORM,
      [INSURANCE_COMPANY]: COMPANY_TYPES,
    },
    prevStep: {},
  },
  CompanyTypes: {
    index: 0,
    component: COMPANY_TYPES,
    nextStep: {
      [INSURANCE_BROKER]: INSURANCE_BROKER_FORM,
      [EXCLUSIVE_AGENT]: EXCLUSIVE_AGENT_FORM,
      [BROKERAGE_SOCIETY]: BROKERAGE_SOCIETY_FORM,
      [INSURANCE_COMPANY]: INSURANCE_COMPANY_FORM,
      [INSURANCE_COMPANY_COOPERATIVE]: INSURANCE_COMPANY_FORM,
      [SUPPLIER]: SUPPLIER_FORM,
    },
    prevStep: {},
  },
  CompanySegments: {
    index: 0,
    component: REGISTER_COMPONENTS.COMPANY_SEGMENTS,
    nextStep: {
      [INSURANCE_BROKER]: INSURANCE_BROKER_FORM,
      [BROKERAGE_SOCIETY]: BROKERAGE_SOCIETY_FORM,
      [EXCLUSIVE_AGENT]: EXCLUSIVE_AGENT_FORM,
    },
    prevStep: { default: COMPANY_TYPES },
  },
  CustomerForm: {
    index: 1,
    component: CUSTOMER_FORM,
    isForm: true,
    nextStep: {
      [CUSTOMER]: SENT_EMAIL_VERIFICATION,
    },
    prevStep: {},
  },
  InsuranceBrokerForm: {
    index: 1,
    component: INSURANCE_BROKER_FORM,
    isForm: true,
    nextStep: {
      [INSURANCE_BROKER]: SENT_EMAIL_VERIFICATION,
    },
    prevStep: { default: COMPANY_TYPES },
  },
  InsuranceCompanyForm: {
    index: 1,
    component: INSURANCE_COMPANY_FORM,
    isForm: true,
    nextStep: {
      [INSURANCE_COMPANY]: DATA_SENT_TO_CONFIRM,
      [INSURANCE_COMPANY_COOPERATIVE]: DATA_SENT_TO_CONFIRM,
    },
    prevStep: { default: COMPANY_TYPES },
  },
  ExclusiveAgentForm: {
    index: 1,
    component: EXCLUSIVE_AGENT_FORM,
    isForm: true,
    nextStep: {
      [EXCLUSIVE_AGENT]: SENT_EMAIL_VERIFICATION,
    },
    prevStep: { default: COMPANY_TYPES },
  },
  SupplierForm: {
    index: 1,
    component: SUPPLIER_FORM,
    isForm: true,
    nextStep: { [SUPPLIER]: SENT_EMAIL_VERIFICATION },
    prevStep: { default: COMPANY_TYPES },
  },
  BrokerageSocietyForm: {
    index: 1,
    component: BROKERAGE_SOCIETY_FORM,
    isForm: true,
    nextStep: { [BROKERAGE_SOCIETY]: SENT_EMAIL_VERIFICATION },
    prevStep: { default: COMPANY_TYPES },
  },
  DataSentToConfirm: {
    index: 2,
    isFinalStep: true,
    component: DATA_SENT_TO_CONFIRM,
    nextStep: {},
    prevStep: { default: COMPANY_TYPES },
  },
  SentEmailVerification: {
    index: 2,
    component: SENT_EMAIL_VERIFICATION,
    nextStep: {},
    prevStep: { default: CUSTOMER_FORM },
  },
  EmailVerificationSuccess: {
    index: 3,
    isFinalStep: true,
    component: EMAIL_VERIFICATION_SUCCESS,
    nextStep: {},
    prevStep: { default: CUSTOMER_FORM },
  },
} as const;
