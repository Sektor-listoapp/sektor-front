import { User } from "@/types/shared";

export interface AuthStoreState {
  accessToken: string | null;
  user: User | null;
}

export interface AuthStoreActions {
  getIsAuthenticated: () => boolean;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: User | null) => void;
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
