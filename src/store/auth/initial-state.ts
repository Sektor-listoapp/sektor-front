import { AuthStoreState } from "./types";

export const initialAuthStoreState: AuthStoreState = {
  accessToken: "",
  refreshToken: "",
  user: null,
  resetPasswordToken: null,
};
