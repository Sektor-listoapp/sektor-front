import { UserType } from "@/lib/sektor-api/__generated__/types";

export interface AuthStoreState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserType | null;
  resetPasswordToken: string | null;
}

export interface AuthStoreActions {
  getIsAuthenticated: () => boolean;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setResetPasswordToken: (resetPasswordToken: string | null) => void;
  setUser: (user: UserType | null) => void;
  resetAuthStore: () => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

export interface AuthStoreSetter {
  (
    partial:
      | AuthStore
      | Partial<AuthStore>
      | ((state: AuthStore) => AuthStore | Partial<AuthStore>),
    replace?: false | undefined,
    action?: string | undefined
  ): void;
  (
    state: AuthStore | ((state: AuthStore) => AuthStore),
    replace: true,
    action?: string | undefined
  ): void;
}

export type AuthStoreGetter = () => AuthStore;
