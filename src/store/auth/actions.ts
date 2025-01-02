import { initialAuthStoreState } from "./initial-state";
import { AuthStoreActions, AuthStoreGetter, AuthStoreSetter } from "./types";

export const authStoreActions = (
  set: AuthStoreSetter,
  get: AuthStoreGetter
): AuthStoreActions => ({
  getIsAuthenticated: () => {
    const hasAccessToken = Boolean(get().accessToken);
    const userExists = Boolean(get().user);
    return hasAccessToken && userExists;
  },
  setAccessToken: (accessToken) => {
    return set({ accessToken }, false, "setAccessToken");
  },
  setUser: (user) => {
    return set({ user }, false, "setUser");
  },
  resetAuthStore: () => {
    return set({ ...initialAuthStoreState }, false, "resetAuthStore");
  },
});
