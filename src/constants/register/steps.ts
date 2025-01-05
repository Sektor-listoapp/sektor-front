import { RegisterStep } from "@/types/register";
import { USER_TYPES } from "../auth";
import { REGISTER_COMPONENTS_MAP, REGISTER_COMPONENTS } from "./components";

const {
  CUSTOMER,
  INSURANCE_BROKER,
  EXCLUSIVE_AGENT,
  BROKERAGE_SOCIETY,
  INSURANCE_COMPANY,
  SUPPLIER,
  INTERMEDIARY,
} = USER_TYPES;

const {
  CUSTOMER_FORM,
  COMPANY_TYPES,
  COMPANY_SEGMENTS,
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
      [INTERMEDIARY]: COMPANY_SEGMENTS,
      [INSURANCE_COMPANY]: INSURANCE_COMPANY_FORM,
      [SUPPLIER]: SUPPLIER_FORM,
    },
    prevStep: { default: REGISTER_COMPONENTS.USER_TYPES },
  },
  CompanySegments: {
    index: 0,
    component: COMPANY_SEGMENTS,
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
    prevStep: { default: REGISTER_COMPONENTS.USER_TYPES },
  },
  InsuranceBrokerForm: {
    index: 1,
    component: INSURANCE_BROKER_FORM,
    isForm: true,
    nextStep: {
      [INSURANCE_BROKER]: SENT_EMAIL_VERIFICATION,
    },
    prevStep: { default: COMPANY_SEGMENTS },
  },
  InsuranceCompanyForm: {
    index: 1,
    component: INSURANCE_COMPANY_FORM,
    isForm: true,
    nextStep: {
      [INSURANCE_COMPANY]: DATA_SENT_TO_CONFIRM,
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
    prevStep: { default: COMPANY_SEGMENTS },
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
    prevStep: { default: COMPANY_SEGMENTS },
  },
  DataSentToConfirm: {
    index: 2,
    isFinalStep: true,
    component: DATA_SENT_TO_CONFIRM,
    nextStep: {},
    prevStep: { default: REGISTER_COMPONENTS.USER_TYPES },
  },
  SentEmailVerification: {
    index: 2,
    component: SENT_EMAIL_VERIFICATION,
    nextStep: {},
    prevStep: { default: REGISTER_COMPONENTS.USER_TYPES },
  },
  EmailVerificationSuccess: {
    index: 3,
    isFinalStep: true,
    component: EMAIL_VERIFICATION_SUCCESS,
    nextStep: {},
    prevStep: { default: REGISTER_COMPONENTS.USER_TYPES },
  },
} as const;
