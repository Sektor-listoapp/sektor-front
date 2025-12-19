export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  File: { input: any; output: any; }
};

export type AddressInputType = {
  cityId: Scalars['Int']['input'];
  countryId: Scalars['Int']['input'];
  placeId?: InputMaybe<Scalars['String']['input']>;
  stateId: Scalars['Int']['input'];
  street: Scalars['String']['input'];
};

export type AddressType = {
  __typename?: 'AddressType';
  city: CityType;
  country: CountryType;
  placeId?: Maybe<Scalars['String']['output']>;
  state: StateType;
  street: Scalars['String']['output'];
};

export type AdminType = {
  __typename?: 'AdminType';
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  group?: Maybe<UserGroups>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AdminUpdateEmailInputType = {
  newEmail: Scalars['String']['input'];
  skipVerification?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['ID']['input'];
};

/** Auto coverages options */
export enum AutoCoverages {
  BasicThirdPartyLiability = 'BasicThirdPartyLiability',
  BasicThirdPartyLiabilityPlusTowingService = 'BasicThirdPartyLiabilityPlusTowingService',
  ComprehensiveCoverage = 'ComprehensiveCoverage',
  TotalLossCoverage = 'TotalLossCoverage'
}

export type AutoQuoteInputType = {
  cityId: Scalars['Int']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
  coverage: AutoCoverages;
  customer: QuoteCustomerInputType;
  id?: InputMaybe<Scalars['String']['input']>;
  make: Scalars['String']['input'];
  model: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  usageType: AutoUsageTypes;
  version: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type AutoQuoteType = {
  __typename?: 'AutoQuoteType';
  city: QuoteCityType;
  comments?: Maybe<Scalars['String']['output']>;
  coverage: AutoCoverages;
  createdAt: Scalars['DateTime']['output'];
  customer: QuoteCustomerType;
  id: Scalars['String']['output'];
  lineOfBusiness: QuoteLineOfBusiness;
  make: Scalars['String']['output'];
  model: Scalars['String']['output'];
  organization: PublicOrganizationType;
  rating?: Maybe<Scalars['Float']['output']>;
  read: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  usageType: AutoUsageTypes;
  version: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

/** Auto usage types */
export enum AutoUsageTypes {
  Cargo = 'Cargo',
  Motorcycle = 'Motorcycle',
  Personal = 'Personal',
  Pickup = 'Pickup',
  Rustic = 'Rustic'
}

export type BankType = {
  __typename?: 'BankType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type BasePublicOrganizationType = {
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  socialMediaLinks: Array<SocialMediaLinkType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export type BatchClientLogoFileUpdateInputType = {
  clientIds: Array<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type BatchClientLogoUpdateInputType = {
  clientUpdates: Array<ClientLogoUpdateInputType>;
  organizationId: Scalars['String']['input'];
};

export type BrokerageSocietyContactInputType = {
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  position: Scalars['String']['input'];
};

export type BrokerageSocietyContactType = {
  __typename?: 'BrokerageSocietyContactType';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  position: Scalars['String']['output'];
};

export type BrokerageSocietyFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  experienceRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type BrokerageSocietyInputType = {
  allies: Array<Scalars['String']['input']>;
  clients: Array<OrganizationClientInputType>;
  contact: BrokerageSocietyContactInputType;
  coverageStates: Array<Scalars['Float']['input']>;
  foundationYear: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  identification?: InputMaybe<Scalars['String']['input']>;
  insuranceCompanies: Array<Scalars['String']['input']>;
  license: Scalars['String']['input'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  modality: OrganizationModality;
  name: Scalars['String']['input'];
  offices: Array<OrganizationOfficeInputType>;
  recognitions: Array<RecognitionInputType>;
  socialMediaLinks: Array<SocialMediaLinkInputType>;
  type: OrganizationTypes;
  workTeam: Array<BrokerageSocietyTeamMemberInputType>;
};

export type BrokerageSocietyPaginatedType = {
  __typename?: 'BrokerageSocietyPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<BrokerageSocietyType>>;
  pages: Scalars['Int']['output'];
};

export type BrokerageSocietyTeamMemberInputType = {
  organization: Scalars['String']['input'];
  position: Scalars['String']['input'];
};

export type BrokerageSocietyTeamMemberType = {
  __typename?: 'BrokerageSocietyTeamMemberType';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organization: PublicOrganizationType;
  photoUrl?: Maybe<Scalars['String']['output']>;
  position: Scalars['String']['output'];
};

export type BrokerageSocietyType = BasePublicOrganizationType & {
  __typename?: 'BrokerageSocietyType';
  allies: Array<PublicOrganizationType>;
  clients: Array<OrganizationClientType>;
  contact: BrokerageSocietyContactType;
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  insuranceCompanies: Array<InsuranceCompanyType>;
  isActive: Scalars['Boolean']['output'];
  license: Scalars['String']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  recognitions: Array<RecognitionType>;
  socialMediaLinks: Array<SocialMediaLinkType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
  workTeam: Array<BrokerageSocietyTeamMemberType>;
};

export type CalendarEventType = {
  __typename?: 'CalendarEventType';
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ChangeOrganizationFeatureInputType = {
  featureKey: OrganizationFeatures;
  id: Scalars['String']['input'];
};

export type ChangeOrganizationPlanInputType = {
  id: Scalars['String']['input'];
  plan: OrganizationPlans;
};

export type ChangeOrganizationVisibilityInputType = {
  id: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
};

export type CityType = {
  __typename?: 'CityType';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type ClientLogoUpdateInputType = {
  clientId: Scalars['String']['input'];
  logoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ConfirmImmediateDebitInputType = {
  holderName: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  paymentId: Scalars['ID']['input'];
};

export type CountryType = {
  __typename?: 'CountryType';
  code: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  states: Array<StateType>;
};

export type CreateCalendarEventInput = {
  date: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateModuleInputType = {
  applicablePlans: Array<SubscriptionPlan>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  latest?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

/** Supported currencies */
export enum Currency {
  Usd = 'USD',
  Ves = 'VES'
}

export type CustomerInputType = {
  birthdate?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sex: Sexes;
};

export type CustomerType = {
  __typename?: 'CustomerType';
  birthdate?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  group: UserGroups;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sex: Sexes;
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Days of the week */
export enum DayOfWeek {
  Friday = 'Friday',
  Monday = 'Monday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Thursday = 'Thursday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday'
}

export type DirectDebitBillingDataInputType = {
  bankCode: Scalars['String']['input'];
  cedula: Scalars['String']['input'];
  holderName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export enum EntityType {
  Organization = 'Organization'
}

export enum EventType {
  Click = 'Click',
  View = 'View'
}

export type ExchangeRateType = {
  __typename?: 'ExchangeRateType';
  from: Scalars['String']['output'];
  rate: Scalars['Float']['output'];
  timestamp: Scalars['DateTime']['output'];
  to: Scalars['String']['output'];
};

export type ExclusiveAgentFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  ageRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  experienceRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  sex?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type ExclusiveAgentInputType = {
  address?: InputMaybe<AddressInputType>;
  allies: Array<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  clients: Array<OrganizationClientInputType>;
  coverageStates: Array<Scalars['Float']['input']>;
  foundationYear: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  identification?: InputMaybe<Scalars['String']['input']>;
  insuranceCompanies: Array<Scalars['String']['input']>;
  license: Scalars['String']['input'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  modality: OrganizationModality;
  name: Scalars['String']['input'];
  offices: Array<OrganizationOfficeInputType>;
  phone?: InputMaybe<Scalars['String']['input']>;
  recognitions: Array<RecognitionInputType>;
  sex: Sexes;
  socialMediaLinks: Array<SocialMediaLinkInputType>;
  studies: Array<StudyInputType>;
  type: OrganizationTypes;
};

export type ExclusiveAgentPaginatedType = {
  __typename?: 'ExclusiveAgentPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<ExclusiveAgentType>>;
  pages: Scalars['Int']['output'];
};

export type ExclusiveAgentType = BasePublicOrganizationType & {
  __typename?: 'ExclusiveAgentType';
  address?: Maybe<AddressType>;
  allies: Array<PublicOrganizationType>;
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  clients: Array<OrganizationClientType>;
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  insuranceCompanies: Array<InsuranceCompanyType>;
  isActive: Scalars['Boolean']['output'];
  license: Scalars['String']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  phone?: Maybe<Scalars['String']['output']>;
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  recognitions: Array<RecognitionType>;
  sex: Sexes;
  socialMediaLinks: Array<SocialMediaLinkType>;
  studies: Array<StudyType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export type FeedbackType = {
  __typename?: 'FeedbackType';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type FileTemplateType = {
  __typename?: 'FileTemplateType';
  /** Base64 encoded file data */
  data: Scalars['String']['output'];
  /** File name */
  name: Scalars['String']['output'];
  /** File type */
  type: Scalars['String']['output'];
};

export type HealthQuoteInputType = {
  cityId: Scalars['Int']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
  customer: QuoteCustomerInputType;
  dateOfBirth: Scalars['String']['input'];
  dental: Scalars['Boolean']['input'];
  funeral: Scalars['Boolean']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  maternity: Scalars['Boolean']['input'];
  organizationId: Scalars['String']['input'];
  primaryCare: Scalars['Boolean']['input'];
  upToInsuranceAmount: Scalars['Int']['input'];
  vision: Scalars['Boolean']['input'];
};

export type HealthQuoteType = {
  __typename?: 'HealthQuoteType';
  city: QuoteCityType;
  comments?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: QuoteCustomerType;
  dateOfBirth: Scalars['String']['output'];
  dental: Scalars['Boolean']['output'];
  funeral: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  lineOfBusiness: QuoteLineOfBusiness;
  maternity: Scalars['Boolean']['output'];
  organization: PublicOrganizationType;
  primaryCare: Scalars['Boolean']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  read: Scalars['Boolean']['output'];
  upToInsuranceAmount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vision: Scalars['Boolean']['output'];
};

export type ImmediateDebitBillingDataInputType = {
  bankCode: Scalars['String']['input'];
  cedula: Scalars['String']['input'];
  holderName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type InitiateDirectDebitInputType = {
  autoRenew: Scalars['Boolean']['input'];
  billingData: DirectDebitBillingDataInputType;
  period: SubscriptionPeriod;
  plan: SubscriptionPlan;
};

export type InitiateImmediateDebitInputType = {
  billingData: ImmediateDebitBillingDataInputType;
  period: SubscriptionPeriod;
  plan: SubscriptionPlan;
};

export type InitiateMobilePaymentInputType = {
  billingData: MobilePaymentBillingDataInputType;
  period: SubscriptionPeriod;
  plan: SubscriptionPlan;
};

export type InitiatePaymentResultType = {
  __typename?: 'InitiatePaymentResultType';
  amountUsd: Scalars['Float']['output'];
  amountVes: Scalars['Float']['output'];
  exchangeRate: Scalars['Float']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  mobilePaymentData?: Maybe<MobilePaymentDataType>;
  payment: PaymentType;
};

export type InsuranceBrokerFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  ageRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  experienceRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  sex?: InputMaybe<Sexes>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type InsuranceBrokerInputType = {
  address?: InputMaybe<AddressInputType>;
  allies: Array<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  clients: Array<OrganizationClientInputType>;
  coverageStates: Array<Scalars['Float']['input']>;
  foundationYear: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  identification?: InputMaybe<Scalars['String']['input']>;
  insuranceCompanies: Array<Scalars['String']['input']>;
  license: Scalars['String']['input'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  modality: OrganizationModality;
  name: Scalars['String']['input'];
  offices: Array<OrganizationOfficeInputType>;
  phone?: InputMaybe<Scalars['String']['input']>;
  recognitions: Array<RecognitionInputType>;
  sex: Sexes;
  socialMediaLinks: Array<SocialMediaLinkInputType>;
  studies: Array<StudyInputType>;
  type: OrganizationTypes;
};

export type InsuranceBrokerPaginatedType = {
  __typename?: 'InsuranceBrokerPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<InsuranceBrokerType>>;
  pages: Scalars['Int']['output'];
};

export type InsuranceBrokerType = BasePublicOrganizationType & {
  __typename?: 'InsuranceBrokerType';
  address?: Maybe<AddressType>;
  allies: Array<PublicOrganizationType>;
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  clients: Array<OrganizationClientType>;
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  insuranceCompanies: Array<InsuranceCompanyType>;
  isActive: Scalars['Boolean']['output'];
  license: Scalars['String']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  phone?: Maybe<Scalars['String']['output']>;
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  recognitions: Array<RecognitionType>;
  sex: Sexes;
  socialMediaLinks: Array<SocialMediaLinkType>;
  studies: Array<StudyType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export type InsuranceCompanyContactInputType = {
  name: Scalars['String']['input'];
};

export type InsuranceCompanyContactType = {
  __typename?: 'InsuranceCompanyContactType';
  name: Scalars['String']['output'];
};

export type InsuranceCompanyFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  experienceRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type InsuranceCompanyInputType = {
  contact: InsuranceCompanyContactInputType;
  coverageStates: Array<Scalars['Float']['input']>;
  foundationYear: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  identification?: InputMaybe<Scalars['String']['input']>;
  license: Scalars['String']['input'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  modality: OrganizationModality;
  motto?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  offices: Array<OrganizationOfficeInputType>;
  socialMediaLinks: Array<SocialMediaLinkInputType>;
  suppliers?: Array<Scalars['String']['input']>;
  type: OrganizationTypes;
};

export type InsuranceCompanyPaginatedType = {
  __typename?: 'InsuranceCompanyPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<InsuranceCompanyType>>;
  pages: Scalars['Int']['output'];
};

export type InsuranceCompanyType = BasePublicOrganizationType & {
  __typename?: 'InsuranceCompanyType';
  contact: InsuranceCompanyContactType;
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  license?: Maybe<Scalars['String']['output']>;
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  motto?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  socialMediaLinks: Array<SocialMediaLinkType>;
  suppliers: Array<SupplierType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginInputType = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponseType = {
  __typename?: 'LoginResponseType';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
  user: UserType;
};

export type MobilePaymentBillingDataInputType = {
  bankCode: Scalars['String']['input'];
  cedula: Scalars['String']['input'];
  holderName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  referenceCode: Scalars['String']['input'];
};

export type MobilePaymentDataType = {
  __typename?: 'MobilePaymentDataType';
  amount: Scalars['Float']['output'];
  bankCode: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  reference: Scalars['String']['output'];
  rif: Scalars['String']['output'];
};

export type ModuleFileType = {
  __typename?: 'ModuleFileType';
  _id: Scalars['ID']['output'];
  contentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  originalName: Scalars['String']['output'];
  size: Scalars['Float']['output'];
  uploadedAt: Scalars['DateTime']['output'];
  uploadedBy: Scalars['ID']['output'];
};

export type ModuleFilterInputType = {
  applicablePlans?: InputMaybe<Array<SubscriptionPlan>>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type ModuleType = {
  __typename?: 'ModuleType';
  _id: Scalars['ID']['output'];
  applicablePlans: Array<SubscriptionPlan>;
  children?: Maybe<Array<ModuleType>>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  files: Array<ModuleFileType>;
  icon?: Maybe<Scalars['String']['output']>;
  latest?: Maybe<Scalars['Boolean']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<ModuleType>;
  parentId?: Maybe<Scalars['ID']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedBy: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminDeleteUser: Scalars['Boolean']['output'];
  adminUpdateUserEmail: UpdateEmailResponseType;
  batchUpdateExclusiveAgentClientLogos: ExclusiveAgentType;
  batchUpdateExclusiveAgentClientLogosWithFiles: ExclusiveAgentType;
  batchUpdateInsuranceBrokerClientLogos: InsuranceBrokerType;
  batchUpdateInsuranceBrokerClientLogosWithFiles: InsuranceBrokerType;
  changeNewsVisibility?: Maybe<NewsType>;
  changeOrganizationFeature: PublicOrganizationType;
  changeOrganizationPlan: OrganizationType;
  changeOrganizationVisibility: OrganizationType;
  /** Step 2: Confirm immediate debit with OTP code. */
  confirmImmediateDebit: InitiatePaymentResultType;
  createCalendarEvent: CalendarEventType;
  createModule: ModuleType;
  createNews: NewsType;
  createTracking: TrackingType;
  deleteFileFromModule: ModuleType;
  deleteModule: Scalars['Boolean']['output'];
  deleteMyAccount: Scalars['Boolean']['output'];
  deleteNews: Scalars['Boolean']['output'];
  deleteOrganization: Scalars['Boolean']['output'];
  deleteTracking: Scalars['Boolean']['output'];
  /** Process direct debit payment with optional auto-renewal. */
  initiateDirectDebit: InitiatePaymentResultType;
  /** Step 1: Initiate immediate debit. Sends OTP to customer phone. */
  initiateImmediateDebit: OtpResultType;
  /** Initiate mobile payment (Pago Móvil). User provides referenceCode in billingData which will be matched with webhook Referencia field. */
  initiateMobilePayment: InitiatePaymentResultType;
  login: LoginResponseType;
  markAllNotificationsAsRead: Scalars['Int']['output'];
  markAsRead?: Maybe<QuoteType>;
  markNotificationAsRead?: Maybe<NotificationType>;
  refreshToken: Scalars['String']['output'];
  registerAsBrokerageSociety: RegisterAsOrganizationResponseType;
  registerAsCustomer: RegisterAsCustomerResponseType;
  registerAsExclusiveAgent: RegisterAsOrganizationResponseType;
  registerAsInsuranceBroker: RegisterAsOrganizationResponseType;
  registerAsInsuranceCompany: RegisterAsOrganizationResponseType;
  registerAsSupplier: RegisterAsOrganizationResponseType;
  registerDevice: Scalars['Boolean']['output'];
  requestAutoQuote: AutoQuoteType;
  requestHealthQuote: HealthQuoteType;
  requestOtherQuote: OtherQuoteType;
  requestPropertyQuote: PropertyQuoteType;
  saveAutoQuote: AutoQuoteType;
  saveHealthQuote: HealthQuoteType;
  saveOtherQuote: OtherQuoteType;
  savePropertyQuote: PropertyQuoteType;
  sendPasswordResetRequest: Scalars['Boolean']['output'];
  sendVerificationEmail: Scalars['Boolean']['output'];
  submitFeedback: FeedbackType;
  submitNews: NewsType;
  unregisterDevice: Scalars['Boolean']['output'];
  updateBrokerageSociety: BrokerageSocietyType;
  updateCalendarEvent: CalendarEventType;
  updateCustomer: CustomerType;
  updateEmail: UpdateEmailResponseType;
  updateExclusiveAgent: ExclusiveAgentType;
  updateExclusiveAgentClientLogo: ExclusiveAgentType;
  updateInsuranceBroker: InsuranceBrokerType;
  updateInsuranceBrokerClientLogo: InsuranceBrokerType;
  updateInsuranceCompany: InsuranceCompanyType;
  updateModule: ModuleType;
  updateModuleOrder: ModuleType;
  updateNews?: Maybe<NewsType>;
  updateNotificationPreferences: NotificationPreferencesType;
  updateOrganizationLogo: OrganizationType;
  updatePassword: Scalars['Boolean']['output'];
  /** Admin: Update subscription price and details */
  updateSubscriptionPrice: SubscriptionPriceType;
  updateSupplier: SupplierType;
  updateTracking?: Maybe<TrackingType>;
  uploadFileToModule: ModuleType;
  uploadOfficesTemplate: Array<UploadFileTemplateResult>;
  uploadOrganizationTemplate: Array<UploadFileTemplateResult>;
};


export type MutationAdminDeleteUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationAdminUpdateUserEmailArgs = {
  input: AdminUpdateEmailInputType;
};


export type MutationBatchUpdateExclusiveAgentClientLogosArgs = {
  input: BatchClientLogoUpdateInputType;
};


export type MutationBatchUpdateExclusiveAgentClientLogosWithFilesArgs = {
  files?: InputMaybe<Array<Scalars['File']['input']>>;
  input: BatchClientLogoFileUpdateInputType;
};


export type MutationBatchUpdateInsuranceBrokerClientLogosArgs = {
  input: BatchClientLogoUpdateInputType;
};


export type MutationBatchUpdateInsuranceBrokerClientLogosWithFilesArgs = {
  files?: InputMaybe<Array<Scalars['File']['input']>>;
  input: BatchClientLogoFileUpdateInputType;
};


export type MutationChangeNewsVisibilityArgs = {
  id: Scalars['String']['input'];
  visibility: Scalars['String']['input'];
};


export type MutationChangeOrganizationFeatureArgs = {
  input: ChangeOrganizationFeatureInputType;
};


export type MutationChangeOrganizationPlanArgs = {
  input: ChangeOrganizationPlanInputType;
};


export type MutationChangeOrganizationVisibilityArgs = {
  input: ChangeOrganizationVisibilityInputType;
};


export type MutationConfirmImmediateDebitArgs = {
  input: ConfirmImmediateDebitInputType;
};


export type MutationCreateCalendarEventArgs = {
  input: CreateCalendarEventInput;
};


export type MutationCreateModuleArgs = {
  input: CreateModuleInputType;
};


export type MutationCreateNewsArgs = {
  input: NewsInputType;
  photo?: InputMaybe<Scalars['File']['input']>;
};


export type MutationCreateTrackingArgs = {
  input: TrackingInputType;
};


export type MutationDeleteFileFromModuleArgs = {
  fileId: Scalars['ID']['input'];
  moduleId: Scalars['ID']['input'];
};


export type MutationDeleteModuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMyAccountArgs = {
  password: Scalars['String']['input'];
};


export type MutationDeleteNewsArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTrackingArgs = {
  id: Scalars['String']['input'];
};


export type MutationInitiateDirectDebitArgs = {
  input: InitiateDirectDebitInputType;
};


export type MutationInitiateImmediateDebitArgs = {
  input: InitiateImmediateDebitInputType;
};


export type MutationInitiateMobilePaymentArgs = {
  input: InitiateMobilePaymentInputType;
};


export type MutationLoginArgs = {
  input: LoginInputType;
};


export type MutationMarkAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterAsBrokerageSocietyArgs = {
  input: RegisterAsBrokerageSocietyInputType;
};


export type MutationRegisterAsCustomerArgs = {
  input: RegisterAsCustomerInputType;
};


export type MutationRegisterAsExclusiveAgentArgs = {
  input: RegisterAsExclusiveAgentInputType;
};


export type MutationRegisterAsInsuranceBrokerArgs = {
  input: RegisterAsInsuranceBrokerInputType;
};


export type MutationRegisterAsInsuranceCompanyArgs = {
  input: RegisterRequestInsuranceCompanyInputType;
};


export type MutationRegisterAsSupplierArgs = {
  input: RegisterAsSupplierInputType;
};


export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInputType;
};


export type MutationRequestAutoQuoteArgs = {
  input: AutoQuoteInputType;
};


export type MutationRequestHealthQuoteArgs = {
  input: HealthQuoteInputType;
};


export type MutationRequestOtherQuoteArgs = {
  input: OtherQuoteInputType;
};


export type MutationRequestPropertyQuoteArgs = {
  input: PropertyQuoteInputType;
};


export type MutationSaveAutoQuoteArgs = {
  input: AutoQuoteInputType;
};


export type MutationSaveHealthQuoteArgs = {
  input: HealthQuoteInputType;
};


export type MutationSaveOtherQuoteArgs = {
  input: OtherQuoteInputType;
};


export type MutationSavePropertyQuoteArgs = {
  input: PropertyQuoteInputType;
};


export type MutationSendPasswordResetRequestArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendVerificationEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationSubmitFeedbackArgs = {
  input: SubmitFeedbackInput;
};


export type MutationSubmitNewsArgs = {
  input: NewsInputType;
  photo?: InputMaybe<Scalars['File']['input']>;
};


export type MutationUnregisterDeviceArgs = {
  token: Scalars['String']['input'];
};


export type MutationUpdateBrokerageSocietyArgs = {
  input: BrokerageSocietyInputType;
};


export type MutationUpdateCalendarEventArgs = {
  input: UpdateCalendarEventInput;
};


export type MutationUpdateCustomerArgs = {
  input: CustomerInputType;
};


export type MutationUpdateEmailArgs = {
  input: UpdateEmailInputType;
};


export type MutationUpdateExclusiveAgentArgs = {
  input: ExclusiveAgentInputType;
};


export type MutationUpdateExclusiveAgentClientLogoArgs = {
  clientId: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['File']['input']>;
  organizationId: Scalars['String']['input'];
};


export type MutationUpdateInsuranceBrokerArgs = {
  input: InsuranceBrokerInputType;
};


export type MutationUpdateInsuranceBrokerClientLogoArgs = {
  clientId: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['File']['input']>;
  organizationId: Scalars['String']['input'];
};


export type MutationUpdateInsuranceCompanyArgs = {
  input: InsuranceCompanyInputType;
};


export type MutationUpdateModuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateModuleInputType;
};


export type MutationUpdateModuleOrderArgs = {
  id: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};


export type MutationUpdateNewsArgs = {
  id: Scalars['String']['input'];
  input: NewsInputType;
  photo?: InputMaybe<Scalars['File']['input']>;
};


export type MutationUpdateNotificationPreferencesArgs = {
  input: UpdateNotificationPreferencesInputType;
};


export type MutationUpdateOrganizationLogoArgs = {
  id: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['File']['input']>;
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInputType;
};


export type MutationUpdateSubscriptionPriceArgs = {
  input: UpdateSubscriptionPriceInput;
};


export type MutationUpdateSupplierArgs = {
  input: SupplierInputType;
};


export type MutationUpdateTrackingArgs = {
  id: Scalars['String']['input'];
  input: TrackingInputType;
};


export type MutationUploadFileToModuleArgs = {
  file: Scalars['File']['input'];
  moduleId: Scalars['ID']['input'];
};


export type MutationUploadOfficesTemplateArgs = {
  file: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationUploadOrganizationTemplateArgs = {
  file: Scalars['String']['input'];
};

export type NewsAdminFilterInputType = {
  pendingApproval?: InputMaybe<Scalars['Boolean']['input']>;
  uploadedBy?: InputMaybe<NewsUploadedBy>;
};

export enum NewsEntryType {
  Interview = 'Interview',
  News = 'News'
}

export type NewsInputType = {
  allowedRoles?: InputMaybe<Array<UserGroups>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  pendingApproval?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
  type: NewsEntryType;
  uploadedBy?: InputMaybe<NewsUploadedBy>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<NewsVisibility>;
};

export type NewsListGroupedType = {
  __typename?: 'NewsListGroupedType';
  interviews: Array<NewsType>;
  news: Array<NewsType>;
};

export type NewsType = {
  __typename?: 'NewsType';
  allowedRoles?: Maybe<Array<UserGroups>>;
  authorName?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pendingApproval: Scalars['Boolean']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: NewsEntryType;
  uploadedBy: NewsUploadedBy;
  uploadedByUserId?: Maybe<Scalars['String']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
  visibility: NewsVisibility;
};

export enum NewsUploadedBy {
  Sektor = 'Sektor',
  ThirdParty = 'ThirdParty'
}

export enum NewsVisibility {
  Private = 'Private',
  Public = 'Public',
  RoleBased = 'RoleBased'
}

export enum NotificationKind {
  ContactViewed = 'ContactViewed',
  QuoteReceived = 'QuoteReceived'
}

export type NotificationPreferencesType = {
  __typename?: 'NotificationPreferencesType';
  enablePush: Scalars['Boolean']['output'];
  enabledTypes: Array<NotificationKind>;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  createdAt: Scalars['DateTime']['output'];
  data?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  type: NotificationKind;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type NotificationsPaginatedType = {
  __typename?: 'NotificationsPaginatedType';
  notifications: Array<NotificationType>;
  total: Scalars['Float']['output'];
  unreadCount: Scalars['Float']['output'];
};

export type OrganizationClientInputType = {
  id?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type OrganizationClientType = {
  __typename?: 'OrganizationClientType';
  id: Scalars['String']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export enum OrganizationFeatures {
  AllowQuoting = 'AllowQuoting'
}

export type OrganizationFeaturesType = {
  __typename?: 'OrganizationFeaturesType';
  featureKey: OrganizationFeatures;
  value: Scalars['Boolean']['output'];
};

export enum OrganizationLineOfBusiness {
  Auto = 'Auto',
  Aviation = 'Aviation',
  Financial = 'Financial',
  Health = 'Health',
  Life = 'Life',
  Property = 'Property',
  Travel = 'Travel'
}

export enum OrganizationModality {
  Hybrid = 'Hybrid',
  Online = 'Online',
  Physical = 'Physical'
}

export type OrganizationOfficeInputType = {
  address: AddressInputType;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  schedule: Array<OrganizationOfficeScheduleInputType>;
};

export type OrganizationOfficeScheduleInputType = {
  fromDay: DayOfWeek;
  fromTime: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  toDay: DayOfWeek;
  toTime: Scalars['String']['input'];
};

export type OrganizationOfficeScheduleType = {
  __typename?: 'OrganizationOfficeScheduleType';
  fromDay: DayOfWeek;
  fromTime: Scalars['String']['output'];
  id: Scalars['String']['output'];
  toDay: DayOfWeek;
  toTime: Scalars['String']['output'];
};

export type OrganizationOfficeType = {
  __typename?: 'OrganizationOfficeType';
  address: AddressType;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  photoUrl?: Maybe<Scalars['String']['output']>;
  schedule: Array<OrganizationOfficeScheduleType>;
};

export type OrganizationPaginatedType = {
  __typename?: 'OrganizationPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<OrganizationType>>;
  pages: Scalars['Int']['output'];
};

export enum OrganizationPlans {
  Premium = 'Premium',
  Standard = 'Standard'
}

export type OrganizationType = {
  __typename?: 'OrganizationType';
  clicks: Scalars['Int']['output'];
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  features: Array<OrganizationFeaturesType>;
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrlPresigned?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  plan: OrganizationPlans;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export enum OrganizationTypes {
  Admin = 'Admin',
  BrokerageSociety = 'BrokerageSociety',
  ExclusiveAgent = 'ExclusiveAgent',
  InsuranceBroker = 'InsuranceBroker',
  InsuranceCompany = 'InsuranceCompany',
  Supplier = 'Supplier'
}

export type OtherQuoteInputType = {
  cityId: Scalars['Int']['input'];
  comments: Scalars['String']['input'];
  customer: QuoteCustomerInputType;
  id?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type OtherQuoteType = {
  __typename?: 'OtherQuoteType';
  city: QuoteCityType;
  comments: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customer: QuoteCustomerType;
  id: Scalars['String']['output'];
  lineOfBusiness: QuoteLineOfBusiness;
  organization: PublicOrganizationType;
  rating?: Maybe<Scalars['Float']['output']>;
  read: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OtpResultType = {
  __typename?: 'OtpResultType';
  message: Scalars['String']['output'];
  otpSent: Scalars['Boolean']['output'];
  payment: PaymentType;
};

export type PaginationType = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sortField?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

/** Available payment methods */
export enum PaymentMethod {
  DirectDebit = 'DirectDebit',
  ImmediateDebit = 'ImmediateDebit',
  MobilePayment = 'MobilePayment'
}

/** Payment transaction status */
export enum PaymentStatus {
  Completed = 'Completed',
  Expired = 'Expired',
  Failed = 'Failed',
  Pending = 'Pending',
  Processing = 'Processing',
  Refunded = 'Refunded'
}

export type PaymentType = {
  __typename?: 'PaymentType';
  amountUsd: Scalars['Float']['output'];
  amountVes: Scalars['Float']['output'];
  concept?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Currency;
  errorMessage?: Maybe<Scalars['String']['output']>;
  exchangeRate: Scalars['Float']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  externalReference?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internalReference?: Maybe<Scalars['String']['output']>;
  method: PaymentMethod;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  status: PaymentStatus;
  subscriptionPeriod: SubscriptionPeriod;
  subscriptionPlan: SubscriptionPlan;
};

export type PropertyQuoteInputType = {
  cityId: Scalars['Int']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
  customer: QuoteCustomerInputType;
  id?: InputMaybe<Scalars['String']['input']>;
  industryAndCommerce: Scalars['Boolean']['input'];
  organizationId: Scalars['String']['input'];
  residentialComplex: Scalars['Boolean']['input'];
};

export type PropertyQuoteType = {
  __typename?: 'PropertyQuoteType';
  city: QuoteCityType;
  comments?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: QuoteCustomerType;
  id: Scalars['String']['output'];
  industryAndCommerce: Scalars['Boolean']['output'];
  lineOfBusiness: QuoteLineOfBusiness;
  organization: PublicOrganizationType;
  rating?: Maybe<Scalars['Float']['output']>;
  read: Scalars['Boolean']['output'];
  residentialComplex: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PublicOrganizationFilterAddressType = {
  city?: InputMaybe<Scalars['Float']['input']>;
};

export type PublicOrganizationFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type PublicOrganizationPaginatedType = {
  __typename?: 'PublicOrganizationPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<PublicOrganizationType>>;
  pages: Scalars['Int']['output'];
};

export type PublicOrganizationType = BasePublicOrganizationType & {
  __typename?: 'PublicOrganizationType';
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  socialMediaLinks: Array<SocialMediaLinkType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminUserById?: Maybe<AdminType>;
  adminUsers: Array<AdminType>;
  allModules: Array<ModuleType>;
  /** Admin: Get all payments */
  allPayments: Array<PaymentType>;
  autoQuoteById: AutoQuoteType;
  /** Get list of available banks */
  banks: Array<BankType>;
  calendarEventsByYear: Array<CalendarEventType>;
  clinics: SupplierPaginatedType;
  customerById: CustomerType;
  /** Get current USD to VES exchange rate */
  exchangeRate: ExchangeRateType;
  getCountryByCode?: Maybe<CountryType>;
  healthQuoteById: HealthQuoteType;
  homeNews: Array<NewsType>;
  insuranceCompaniesByClinic: Array<Scalars['String']['output']>;
  moduleById?: Maybe<ModuleType>;
  modules: Array<ModuleType>;
  /** Get payment history for current user/organization */
  myPayments: Array<PaymentType>;
  /** Get subscription details for the current organization */
  mySubscription?: Maybe<SubscriptionDetailsType>;
  news: Array<NewsType>;
  newsAndInterviewsList: NewsListGroupedType;
  newsById?: Maybe<NewsType>;
  newsUserById?: Maybe<UserType>;
  newsUsers: Array<UserType>;
  notificationPreferences: NotificationPreferencesType;
  notifications: NotificationsPaginatedType;
  officesTemplate: FileTemplateType;
  organizationById: OrganizationType;
  organizationTemplate: FileTemplateType;
  otherQuoteById: OtherQuoteType;
  /** Get payment by ID */
  payment?: Maybe<PaymentType>;
  profile: UserType;
  propertyQuoteById: PropertyQuoteType;
  publicBrokerageSocieties: BrokerageSocietyPaginatedType;
  publicBrokerageSocietyById: BrokerageSocietyType;
  publicExclusiveAgentById: ExclusiveAgentType;
  publicExclusiveAgents: ExclusiveAgentPaginatedType;
  publicInsuranceBrokerById: InsuranceBrokerType;
  publicInsuranceBrokers: InsuranceBrokerPaginatedType;
  publicInsuranceCompanies: InsuranceCompanyPaginatedType;
  publicInsuranceCompanyById: InsuranceCompanyType;
  publicOrganizations: PublicOrganizationPaginatedType;
  publicSupplierById: SupplierType;
  publicSuppliers: SupplierPaginatedType;
  quoteById?: Maybe<QuoteType>;
  quotes: QuotePaginatedType;
  searchOrganizations: OrganizationPaginatedType;
  /** Get subscription price for a specific plan */
  subscriptionPrice?: Maybe<SubscriptionPriceType>;
  /** Get subscription prices */
  subscriptionPrices: Array<SubscriptionPriceType>;
  trackingByEntityId: Array<TrackingType>;
  trackingByEventType: Array<TrackingType>;
  trackingById?: Maybe<TrackingType>;
  unreadNotificationCount: Scalars['Int']['output'];
};


export type QueryAdminUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAllModulesArgs = {
  filter?: InputMaybe<ModuleFilterInputType>;
};


export type QueryAllPaymentsArgs = {
  organizationId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAutoQuoteByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCalendarEventsByYearArgs = {
  year: Scalars['Int']['input'];
};


export type QueryClinicsArgs = {
  filter?: InputMaybe<SupplierFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryCustomerByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetCountryByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryHealthQuoteByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryInsuranceCompaniesByClinicArgs = {
  clinicId: Scalars['String']['input'];
};


export type QueryModuleByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModulesArgs = {
  filter?: InputMaybe<ModuleFilterInputType>;
};


export type QueryNewsArgs = {
  filter?: InputMaybe<NewsAdminFilterInputType>;
};


export type QueryNewsByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryNewsUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryNotificationsArgs = {
  pagination?: InputMaybe<PaginationType>;
};


export type QueryOrganizationByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryOtherQuoteByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPaymentArgs = {
  id: Scalars['String']['input'];
};


export type QueryPropertyQuoteByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPublicBrokerageSocietiesArgs = {
  filter?: InputMaybe<BrokerageSocietyFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicBrokerageSocietyByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPublicExclusiveAgentByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPublicExclusiveAgentsArgs = {
  filter?: InputMaybe<ExclusiveAgentFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicInsuranceBrokerByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPublicInsuranceBrokersArgs = {
  filter?: InputMaybe<InsuranceBrokerFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicInsuranceCompaniesArgs = {
  filter?: InputMaybe<InsuranceCompanyFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicInsuranceCompanyByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPublicOrganizationsArgs = {
  filter?: InputMaybe<PublicOrganizationFilterType>;
  pagination: PaginationType;
};


export type QueryPublicSupplierByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPublicSuppliersArgs = {
  filter?: InputMaybe<SupplierFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryQuoteByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryQuotesArgs = {
  filter?: InputMaybe<QuoteFilterType>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationType>;
};


export type QuerySearchOrganizationsArgs = {
  filter?: InputMaybe<SearchOrganizationFilterType>;
  pagination: PaginationType;
};


export type QuerySubscriptionPriceArgs = {
  plan: SubscriptionPlan;
};


export type QueryTrackingByEntityIdArgs = {
  entityId: Scalars['String']['input'];
};


export type QueryTrackingByEventTypeArgs = {
  eventType: EventType;
};


export type QueryTrackingByIdArgs = {
  id: Scalars['String']['input'];
};

export type QuoteCityType = {
  __typename?: 'QuoteCityType';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type QuoteCustomerInputType = {
  email: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type QuoteCustomerType = {
  __typename?: 'QuoteCustomerType';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type QuoteFilterType = {
  customerName?: InputMaybe<Scalars['String']['input']>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  lineOfBusinesses?: InputMaybe<Array<Scalars['String']['input']>>;
  read?: InputMaybe<Scalars['Boolean']['input']>;
};

/** The line of business for the quote */
export enum QuoteLineOfBusiness {
  Auto = 'Auto',
  Health = 'Health',
  Other = 'Other',
  Property = 'Property'
}

export type QuotePaginatedType = {
  __typename?: 'QuotePaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<QuoteType>>;
  pages: Scalars['Int']['output'];
};

export type QuoteType = {
  __typename?: 'QuoteType';
  city: QuoteCityType;
  comments?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: QuoteCustomerType;
  id: Scalars['String']['output'];
  lineOfBusiness: QuoteLineOfBusiness;
  organization: PublicOrganizationType;
  rating?: Maybe<Scalars['Float']['output']>;
  read: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RecognitionInputType = {
  date: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  giver: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export type RecognitionType = {
  __typename?: 'RecognitionType';
  date: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  giver: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type RegisterAsBrokerageSocietyInputType = {
  contact: BrokerageSocietyContactInputType;
  email: Scalars['String']['input'];
  license: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rif: Scalars['String']['input'];
};

export type RegisterAsCustomerInputType = {
  birthdate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  sex: Sexes;
};

export type RegisterAsCustomerResponseType = {
  __typename?: 'RegisterAsCustomerResponseType';
  customerId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type RegisterAsExclusiveAgentInputType = {
  email: Scalars['String']['input'];
  license: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  sex: Sexes;
};

export type RegisterAsInsuranceBrokerInputType = {
  email: Scalars['String']['input'];
  license: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  sex: Sexes;
};

export type RegisterAsOrganizationResponseType = {
  __typename?: 'RegisterAsOrganizationResponseType';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: OrganizationTypes;
  userId: Scalars['String']['output'];
};

export type RegisterAsSupplierInputType = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  offices?: InputMaybe<Array<OrganizationOfficeInputType>>;
  password: Scalars['String']['input'];
  serviceType: ServiceSupplierTypes;
};

export type RegisterDeviceInputType = {
  platform: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type RegisterRequestInsuranceCompanyInputType = {
  companyName: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  instagramUrl?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type SearchOrganizationFilterType = {
  createdAfter?: InputMaybe<Scalars['String']['input']>;
  createdBefore?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<OrganizationTypes>;
};

export enum ServiceSupplierTypes {
  Clinic = 'Clinic',
  MedicalHouse = 'MedicalHouse',
  PrimaryCare = 'PrimaryCare',
  Workshop = 'Workshop'
}

export enum Sexes {
  Female = 'Female',
  Male = 'Male',
  PreferNotSay = 'PreferNotSay'
}

export type SocialMediaLinkInputType = {
  platform: SocialMediaPlatform;
  url: Scalars['String']['input'];
};

export type SocialMediaLinkType = {
  __typename?: 'SocialMediaLinkType';
  platform: SocialMediaPlatform;
  url: Scalars['String']['output'];
};

/** Social media platform */
export enum SocialMediaPlatform {
  EmergencyPhone = 'EmergencyPhone',
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Phone = 'Phone',
  Twitter = 'Twitter',
  Website = 'Website',
  Whatsapp = 'Whatsapp'
}

export type StateType = {
  __typename?: 'StateType';
  cities: Array<CityType>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type StudyInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type StudyType = {
  __typename?: 'StudyType';
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  institution: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type SubmitFeedbackInput = {
  content: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type SubscriptionDetailsType = {
  __typename?: 'SubscriptionDetailsType';
  autoRenew: Scalars['Boolean']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  gracePeriodEndDate?: Maybe<Scalars['DateTime']['output']>;
  isGracePeriod: Scalars['Boolean']['output'];
  isPaid: Scalars['Boolean']['output'];
  nextBillingDate?: Maybe<Scalars['DateTime']['output']>;
  period?: Maybe<SubscriptionPeriod>;
  plan: SubscriptionPlan;
  preferredPaymentMethod?: Maybe<PaymentMethod>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
};

/** Subscription billing period */
export enum SubscriptionPeriod {
  Annual = 'Annual',
  Monthly = 'Monthly'
}

export enum SubscriptionPlan {
  Bronze = 'Bronze',
  Diamond = 'Diamond',
  Free = 'Free',
  Gold = 'Gold'
}

export type SubscriptionPriceType = {
  __typename?: 'SubscriptionPriceType';
  annualPriceUsd: Scalars['Float']['output'];
  annualPriceVes?: Maybe<Scalars['Float']['output']>;
  features: Array<Scalars['String']['output']>;
  monthlyPriceUsd: Scalars['Float']['output'];
  monthlyPriceVes?: Maybe<Scalars['Float']['output']>;
  plan: SubscriptionPlan;
  title: Scalars['String']['output'];
};

export type SupplierFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['String']['input']>;
  serviceType?: InputMaybe<Scalars['String']['input']>;
  stateId?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type SupplierInputType = {
  allies: Array<Scalars['String']['input']>;
  coverageStates: Array<Scalars['Float']['input']>;
  foundationYear: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  identification?: InputMaybe<Scalars['String']['input']>;
  insuranceCompanies: Array<Scalars['String']['input']>;
  insuranceCompanyRelations?: InputMaybe<Array<SupplierInsuranceCompanyRelationInputType>>;
  license?: InputMaybe<Scalars['String']['input']>;
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  modality: OrganizationModality;
  motto?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  offices: Array<OrganizationOfficeInputType>;
  serviceType: ServiceSupplierTypes;
  services: Array<SupplierServiceInputType>;
  socialMediaLinks: Array<SocialMediaLinkInputType>;
  type: OrganizationTypes;
};

export type SupplierInsuranceCompanyRelationInputType = {
  depositRequired?: Scalars['Boolean']['input'];
  fullyContractedClinic?: Scalars['Boolean']['input'];
  insuranceCompanyId: Scalars['String']['input'];
  reasonableExpensesApplicable?: Scalars['Boolean']['input'];
};

export type SupplierInsuranceCompanyRelationType = {
  __typename?: 'SupplierInsuranceCompanyRelationType';
  depositRequired: Scalars['Boolean']['output'];
  fullyContractedClinic: Scalars['Boolean']['output'];
  insuranceCompanyId: Scalars['String']['output'];
  reasonableExpensesApplicable: Scalars['Boolean']['output'];
};

export type SupplierPaginatedType = {
  __typename?: 'SupplierPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<SupplierType>>;
  pages: Scalars['Int']['output'];
};

export type SupplierServiceInputType = {
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type SupplierServiceType = {
  __typename?: 'SupplierServiceType';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SupplierType = BasePublicOrganizationType & {
  __typename?: 'SupplierType';
  allies: Array<PublicOrganizationType>;
  coverageStates: Array<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  foundationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  identification?: Maybe<Scalars['String']['output']>;
  insuranceCompanies: Array<InsuranceCompanyType>;
  insuranceCompanyRelations: Array<SupplierInsuranceCompanyRelationType>;
  isActive: Scalars['Boolean']['output'];
  license?: Maybe<Scalars['String']['output']>;
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  motto?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  serviceType: ServiceSupplierTypes;
  services: Array<SupplierServiceType>;
  socialMediaLinks: Array<SocialMediaLinkType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export type TrackingInputType = {
  entityId: Scalars['String']['input'];
  entityType: EntityType;
  eventType: EventType;
  user?: InputMaybe<TrackingUserInputType>;
};

export type TrackingType = {
  __typename?: 'TrackingType';
  _id: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  entityId: Scalars['String']['output'];
  entityType: EntityType;
  eventType: EventType;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<TrackingUserType>;
};

export type TrackingUserInputType = {
  _id?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  group: UserGroups;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type TrackingUserType = {
  __typename?: 'TrackingUserType';
  _id?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  group: UserGroups;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type UpdateCalendarEventInput = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmailInputType = {
  newEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateEmailResponseType = {
  __typename?: 'UpdateEmailResponseType';
  message: Scalars['String']['output'];
  newEmail: Scalars['String']['output'];
  requiresVerification: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
  verificationSent?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateModuleInputType = {
  applicablePlans?: InputMaybe<Array<SubscriptionPlan>>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  latest?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNotificationPreferencesInputType = {
  enablePush?: InputMaybe<Scalars['Boolean']['input']>;
  enabledTypes?: InputMaybe<Array<NotificationKind>>;
};

export type UpdatePasswordInputType = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type UpdateSubscriptionPriceInput = {
  annualPriceUsd?: InputMaybe<Scalars['Float']['input']>;
  features?: InputMaybe<Array<Scalars['String']['input']>>;
  monthlyPriceUsd?: InputMaybe<Scalars['Float']['input']>;
  plan: SubscriptionPlan;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UploadFileTemplateResult = {
  __typename?: 'UploadFileTemplateResult';
  /** Message associated with the upload result */
  message: Scalars['String']['output'];
  /** Status of the upload */
  status: Scalars['String']['output'];
  /** Type of the organization */
  type: Scalars['String']['output'];
};

export enum UserGroups {
  Admin = 'Admin',
  Customer = 'Customer',
  Member = 'Member',
  News = 'News'
}

export type UserType = {
  __typename?: 'UserType';
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  group?: Maybe<UserGroups>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};
