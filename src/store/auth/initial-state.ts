import { AuthStoreState } from "./types";

export const initialAuthStoreState: AuthStoreState = {
  accessToken: "",
  user: null,
  resetPasswordToken: null,
};
