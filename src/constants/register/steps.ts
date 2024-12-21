import { USER_TYPES } from "../auth";

const {
  CUSTOMER,
  INSURANCE_BROKER,
  EXCLUSIVE_AGENT,
  BROKERAGE_SOCIETY,
  INSURANCE_COMPANY,
  SUPPLIER,
} = USER_TYPES;

export const REGISTER_STEPS = {
  UserTypes: {
    index: 0,
    component: "UserTypes",
    nextStep: {
      [CUSTOMER]: "CustomerForm",
      [INSURANCE_COMPANY]: "CompanyTypes",
    },
  },
  CompanyTypes: {
    index: 0,
    component: "CompanyTypes",
    nextStep: "CompanySegments",
  },
  CompanySegments: {
    index: 0,
    component: "CompanySegments",
    nextStep: {
      [INSURANCE_BROKER]: "InsuranceBrokerForm",
      [EXCLUSIVE_AGENT]: "ExclusiveAgentForm",
      [SUPPLIER]: "SupplierForm",
      [BROKERAGE_SOCIETY]: "BrokerageSocietyForm",
    },
  },
  CustomerForm: {
    index: 1,
    userType: CUSTOMER,
    component: "CustomerForm",
    nextStep: "SentEmailVerification",
  },
  InsuranceBrokerForm: {
    index: 1,
    userType: INSURANCE_BROKER,
    component: "InsuranceBrokerForm",
    nextStep: "SentEmailVerification",
  },
  ExclusiveAgentForm: {
    index: 1,
    userType: EXCLUSIVE_AGENT,
    component: "ExclusiveAgentForm",
    nextStep: "SentEmailVerification",
  },
  SupplierForm: {
    index: 1,
    userType: SUPPLIER,
    component: "SupplierForm",
    nextStep: "SentEmailVerification",
  },
  BrokerageSocietyForm: {
    index: 1,
    userType: BROKERAGE_SOCIETY,
    component: "BrokerageSocietyForm",
    nextStep: "SentEmailVerification",
  },
  SentEmailVerification: {
    index: 2,
    component: "SentEmailVerification",
  },
  EmailVerification: {
    index: 3,
    component: "EmailVerification",
  },
} as const;
