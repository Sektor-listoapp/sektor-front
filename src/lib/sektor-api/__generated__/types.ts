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
  stateId: Scalars['Int']['input'];
  street: Scalars['String']['input'];
};

export type AddressType = {
  __typename?: 'AddressType';
  city: CityType;
  country: CountryType;
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
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
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
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
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
  links: Array<SocialMediaLinkType>;
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
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
  workTeam: Array<TeamMemberType>;
  socialMediaLinks: Array<SocialMediaLinkType>;

  
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

export type CountryType = {
  __typename?: 'CountryType';
  code: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  states: Array<StateType>;
};

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

export enum EntityType {
  Organization = 'Organization'
}

export enum EventType {
  Click = 'Click',
  View = 'View'
}

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
  phone?: InputMaybe<Scalars['String']['input']>;
  recognitions: Array<RecognitionInputType>;
  sex: Sexes;
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
  phone?: Maybe<Scalars['String']['output']>;
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  recognitions: Array<RecognitionType>;
  sex: Sexes;
  studies: Array<StudyType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
  socialMediaLinks: Array<SocialMediaLinkType>;
  offices: Array<OrganizationOfficeType>;
  contact: BrokerageSocietyContactType;
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
  phone?: InputMaybe<Scalars['String']['input']>;
  recognitions: Array<RecognitionInputType>;
  sex: Sexes;
  studies: Array<StudyInputType>;
  type: OrganizationTypes;
  socialMediaLinks: Array<SocialMediaLinkInputType>;
};

export type InsuranceBrokerPaginatedType = {
  __typename?: 'InsuranceBrokerPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<InsuranceBrokerType>>;
  pages: Scalars['Int']['output'];
};

export type InsuranceBrokerContactType = {
  __typename?: 'InsuranceBrokerContactType';
  links: Array<SocialMediaLinkType>;
  name: Scalars['String']['output'];
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
  phone?: Maybe<Scalars['String']['output']>;
  plan: OrganizationPlans;
  rating: Scalars['Float']['output'];
  recognitions: Array<RecognitionType>;
  sex: Sexes;
  studies: Array<StudyType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
  socialMediaLinks: Array<SocialMediaLinkType>;
  offices: Array<OrganizationOfficeType>;
  contact: InsuranceBrokerContactType;
};

export type InsuranceCompanyContactInputType = {
  links: Array<SocialMediaLinkInputType>;
  name: Scalars['String']['input'];
};

export type InsuranceCompanyContactType = {
  __typename?: 'InsuranceCompanyContactType';
  links: Array<SocialMediaLinkType>;
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
  suppliers: Array<SupplierType>;
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
  socialMediaLinks: Array<SocialMediaLinkType>;
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

export type Mutation = {
  __typename?: 'Mutation';
  changeOrganizationFeature: PublicOrganizationType;
  changeOrganizationPlan: OrganizationType;
  changeOrganizationVisibility: OrganizationType;
  createTracking: TrackingType;
  deleteOrganization: Scalars['Boolean']['output'];
  deleteTracking: Scalars['Boolean']['output'];
  login: LoginResponseType;
  markAsRead?: Maybe<QuoteType>;
  refreshToken: Scalars['String']['output'];
  registerAsBrokerageSociety: RegisterAsOrganizationResponseType;
  registerAsCustomer: RegisterAsCustomerResponseType;
  registerAsExclusiveAgent: RegisterAsOrganizationResponseType;
  registerAsInsuranceBroker: RegisterAsOrganizationResponseType;
  registerAsInsuranceCompany: RegisterAsOrganizationResponseType;
  registerAsSupplier: RegisterAsOrganizationResponseType;
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
  updateBrokerageSociety: BrokerageSocietyType;
  updateCustomer: CustomerType;
  updateExclusiveAgent: ExclusiveAgentType;
  updateExclusiveAgentClientLogo: ExclusiveAgentType;
  updateInsuranceBroker: InsuranceBrokerType;
  updateInsuranceBrokerClientLogo: InsuranceBrokerType;
  updateInsuranceCompany: InsuranceCompanyType;
  updateOrganizationLogo: OrganizationType;
  updatePassword: Scalars['Boolean']['output'];
  updateSupplier: SupplierType;
  updateTracking?: Maybe<TrackingType>;
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


export type MutationCreateTrackingArgs = {
  input: TrackingInputType;
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTrackingArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInputType;
};


export type MutationMarkAsReadArgs = {
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


export type MutationUpdateBrokerageSocietyArgs = {
  input: BrokerageSocietyInputType;
};


export type MutationUpdateCustomerArgs = {
  input: CustomerInputType;
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


export type MutationUpdateOrganizationLogoArgs = {
  id: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['File']['input']>;
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInputType;
};


export type MutationUpdateSupplierArgs = {
  input: SupplierInputType;
};


export type MutationUpdateTrackingArgs = {
  id: Scalars['String']['input'];
  input: TrackingInputType;
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

export type PaginationType = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sortField?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
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
  type: OrganizationTypes;
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminUserById?: Maybe<AdminType>;
  adminUsers: Array<AdminType>;
  autoQuoteById: AutoQuoteType;
  customerById: CustomerType;
  getCountryByCode?: Maybe<CountryType>;
  healthQuoteById: HealthQuoteType;
  organizationById: OrganizationType;
  otherQuoteById: OtherQuoteType;
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
  trackingByEntityId: Array<TrackingType>;
  trackingByEventType: Array<TrackingType>;
  trackingById?: Maybe<TrackingType>;
};


export type QueryAdminUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAutoQuoteByIdArgs = {
  id: Scalars['String']['input'];
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


export type QueryOrganizationByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryOtherQuoteByIdArgs = {
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
};

export type RegisterAsInsuranceBrokerInputType = {
  email: Scalars['String']['input'];
  license: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
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
  password: Scalars['String']['input'];
  serviceType: ServiceSupplierTypes;
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

export type SupplierFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  serviceType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type SupplierInputType = {
  allies: Array<Scalars['String']['input']>;
  coverageStates: Array<Scalars['Float']['input']>;
  foundationYear: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  identification?: InputMaybe<Scalars['String']['input']>;
  insuranceCompanies: Array<Scalars['String']['input']>;
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

export type SupplierContactType = {
  __typename?: 'SupplierContactType';
  links: Array<SocialMediaLinkType>;
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
  contact: SupplierContactType;
};

export type TeamMemberType = {
  __typename?: 'TeamMemberType';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
  position: Scalars['String']['output'];
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

export type UpdatePasswordInputType = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export enum UserGroups {
  Admin = 'Admin',
  Customer = 'Customer',
  Member = 'Member'
}

export type UserType = {
  __typename?: 'UserType';
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  group?: Maybe<UserGroups>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};


