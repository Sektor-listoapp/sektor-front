/* eslint-disable */
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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AddressType = {
  __typename?: 'AddressType';
  city: CityType;
  country: CountryType;
  state: StateType;
  street: Scalars['String']['output'];
};

export type BrokerageSocietyContactInputType = {
  name: Scalars['String']['input'];
  position: Scalars['String']['input'];
};

export type BrokerageSocietyContactType = {
  __typename?: 'BrokerageSocietyContactType';
  name: Scalars['String']['output'];
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

export type BrokerageSocietyPaginatedType = {
  __typename?: 'BrokerageSocietyPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<BrokerageSocietyType>>;
  pages: Scalars['Int']['output'];
};

export type BrokerageSocietyType = {
  __typename?: 'BrokerageSocietyType';
  allies: Array<OrganizationTypes>;
  clients: Array<OrganizationClientType>;
  contact: BrokerageSocietyContactType;
  coverageStates: Array<Scalars['Float']['output']>;
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  insuranceCompanies: Array<InsuranceCompanyType>;
  isActive: Scalars['Boolean']['output'];
  license: Scalars['String']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  phone: Scalars['String']['output'];
  recognitions: Array<Scalars['String']['output']>;
  rif: Scalars['String']['output'];
  type: OrganizationTypes;
  workTeam: Array<OrganizationTeamMemberType>;
};

export type CityType = {
  __typename?: 'CityType';
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type CountryType = {
  __typename?: 'CountryType';
  code: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  states: Array<StateType>;
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

export type ExclusiveAgentPaginatedType = {
  __typename?: 'ExclusiveAgentPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<ExclusiveAgentType>>;
  pages: Scalars['Int']['output'];
};

export type ExclusiveAgentType = {
  __typename?: 'ExclusiveAgentType';
  address?: Maybe<AddressType>;
  allies: Array<OrganizationTypes>;
  birthDate: Scalars['DateTime']['output'];
  clients: Array<OrganizationClientType>;
  coverageStates: Array<Scalars['Float']['output']>;
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  license: Scalars['String']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  recognitions: Array<Scalars['String']['output']>;
  sex: Sexes;
  type: OrganizationTypes;
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

export type InsuranceBrokerPaginatedType = {
  __typename?: 'InsuranceBrokerPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<InsuranceBrokerType>>;
  pages: Scalars['Int']['output'];
};

export type InsuranceBrokerType = {
  __typename?: 'InsuranceBrokerType';
  address?: Maybe<AddressType>;
  allies: Array<OrganizationTypes>;
  birthDate: Scalars['DateTime']['output'];
  clients: Array<OrganizationClientType>;
  coverageStates: Array<Scalars['Float']['output']>;
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  license: Scalars['String']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  recognitions: Array<Scalars['String']['output']>;
  sex: Sexes;
  type: OrganizationTypes;
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

export type InsuranceCompanyPaginatedType = {
  __typename?: 'InsuranceCompanyPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<InsuranceCompanyType>>;
  pages: Scalars['Int']['output'];
};

export type InsuranceCompanyType = {
  __typename?: 'InsuranceCompanyType';
  contact: InsuranceCompanyContactType;
  coverageStates: Array<Scalars['Float']['output']>;
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  motto?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  phone: Scalars['String']['output'];
  type: OrganizationTypes;
};

export type LoginInputType = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponseType = {
  __typename?: 'LoginResponseType';
  token: Scalars['String']['output'];
  user: UserType;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponseType;
  registerAsBrokerageSociety: RegisterAsOrganizationResponseType;
  registerAsCustomer: RegisterAsCustomerResponseType;
  registerAsExclusiveAgent: RegisterAsOrganizationResponseType;
  registerAsInsuranceBroker: RegisterAsOrganizationResponseType;
  registerAsInsuranceCompany: RegisterAsOrganizationResponseType;
  registerAsSupplier: RegisterAsOrganizationResponseType;
  sendPasswordResetRequest: Scalars['Boolean']['output'];
  sendVerificationEmail: Scalars['Boolean']['output'];
  updatePassword: Scalars['Boolean']['output'];
};


export type MutationLoginArgs = {
  input: LoginInputType;
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


export type MutationSendPasswordResetRequestArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendVerificationEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInputType;
};

export type OrganizationClientType = {
  __typename?: 'OrganizationClientType';
  id: Scalars['String']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
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

export type OrganizationOfficeScheduleType = {
  __typename?: 'OrganizationOfficeScheduleType';
  day: DayOfWeek;
  from: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type OrganizationOfficeType = {
  __typename?: 'OrganizationOfficeType';
  address: AddressType;
  id: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  schedule: Array<OrganizationOfficeScheduleType>;
};

export type OrganizationTeamMemberType = {
  __typename?: 'OrganizationTeamMemberType';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
  position: Scalars['String']['output'];
};

export enum OrganizationTypes {
  Admin = 'Admin',
  BrokerageSociety = 'BrokerageSociety',
  ExclusiveAgent = 'ExclusiveAgent',
  InsuranceBroker = 'InsuranceBroker',
  InsuranceCompany = 'InsuranceCompany',
  Supplier = 'Supplier'
}

export type PaginationType = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sortField?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
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

export type PublicOrganizationType = {
  __typename?: 'PublicOrganizationType';
  coverageStates: Array<Scalars['Float']['output']>;
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  type: OrganizationTypes;
};

export type Query = {
  __typename?: 'Query';
  getCountryByCode?: Maybe<CountryType>;
  profile: UserType;
  publicBrokerageSocieties: BrokerageSocietyPaginatedType;
  publicExclusiveAgents: ExclusiveAgentPaginatedType;
  publicInsuranceBrokers: InsuranceBrokerPaginatedType;
  publicInsuranceCompanies: InsuranceCompanyPaginatedType;
  publicOrganizations: PublicOrganizationPaginatedType;
  publicSuppliers: SupplierPaginatedType;
};


export type QueryGetCountryByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryPublicBrokerageSocietiesArgs = {
  filter?: InputMaybe<BrokerageSocietyFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicExclusiveAgentsArgs = {
  filter?: InputMaybe<ExclusiveAgentFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicInsuranceBrokersArgs = {
  filter?: InputMaybe<InsuranceBrokerFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicInsuranceCompaniesArgs = {
  filter?: InputMaybe<InsuranceCompanyFilterType>;
  pagination?: InputMaybe<PaginationType>;
};


export type QueryPublicOrganizationsArgs = {
  filter?: InputMaybe<PublicOrganizationFilterType>;
  pagination: PaginationType;
};


export type QueryPublicSuppliersArgs = {
  filter?: InputMaybe<SupplierFilterType>;
  pagination?: InputMaybe<PaginationType>;
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

export enum ServiceSupplierTypes {
  Clinic = 'Clinic',
  MedicalHouse = 'MedicalHouse',
  PrimaryCare = 'PrimaryCare',
  Workshop = 'Workshop'
}

export enum Sexes {
  Female = 'Female',
  Male = 'Male',
  PreferNotToSay = 'PreferNotToSay'
}

export type SocialMediaLinkType = {
  __typename?: 'SocialMediaLinkType';
  platform: SocialMediaPlatform;
  url: Scalars['String']['output'];
};

/** Social media platform */
export enum SocialMediaPlatform {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Twitter = 'Twitter',
  Website = 'Website',
  Whatsapp = 'Whatsapp'
}

export type StateType = {
  __typename?: 'StateType';
  cities: Array<CityType>;
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type SupplierFilterType = {
  address?: InputMaybe<PublicOrganizationFilterAddressType>;
  lineOfBusiness?: InputMaybe<OrganizationLineOfBusiness>;
  modality?: InputMaybe<OrganizationModality>;
  name?: InputMaybe<Scalars['String']['input']>;
  serviceType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type SupplierPaginatedType = {
  __typename?: 'SupplierPaginatedType';
  count: Scalars['Int']['output'];
  items?: Maybe<Array<SupplierType>>;
  pages: Scalars['Int']['output'];
};

export type SupplierServiceType = {
  __typename?: 'SupplierServiceType';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SupplierType = {
  __typename?: 'SupplierType';
  coverageStates: Array<Scalars['Float']['output']>;
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lineOfBusiness: Array<OrganizationLineOfBusiness>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  modality: OrganizationModality;
  motto?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  offices: Array<OrganizationOfficeType>;
  phone: Scalars['String']['output'];
  serviceType: ServiceSupplierTypes;
  services: Array<SupplierServiceType>;
  type: OrganizationTypes;
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
