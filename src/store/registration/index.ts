import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

import { registrationStoreActions } from "./actions";
import { initialRegistrationStoreState } from "./initial-state";
import { RegistrationStore } from "./types";

const registrationStore: StateCreator<
  RegistrationStore,
  [["zustand/devtools", never]]
> = (set) => ({
  ...initialRegistrationStoreState,
  ...registrationStoreActions(set),
});

export const useRegistrationStore = create<RegistrationStore>()(
  devtools(registrationStore, { name: "registration-store" })
);
