import { USER_TYPES } from "@/constants/auth";

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES] | null;

export enum UserGroups {
  Admin = "admin",
  Member = "member", // miembro de la organización
  Customer = "customer", // cliente persona natural
}

export interface User {
  id: string;
  name: string;
  email: string;
  deletedAt: string;
  verifiedAt: string;
  companies: string[];
  group: UserGroups;
}

export interface OrganizationAddress {
  street: string;
  city: string;
  state: string;
  country: string;
}
