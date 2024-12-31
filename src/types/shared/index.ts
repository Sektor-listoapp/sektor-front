import { USER_TYPES } from "@/constants/auth";

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES] | null;
