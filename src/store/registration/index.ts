import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { registrationStoreActions } from "./actions";
import { initialRegistrationStoreState } from "./initial-state";
import { RegistrationStore } from "./types";

const registrationStore: StateCreator<
  RegistrationStore,
  [["zustand/devtools", never]]
> = (set, get) => ({
  ...initialRegistrationStoreState,
  ...registrationStoreActions(set, get),
});

export const useRegistrationStore = create<RegistrationStore>()(
  devtools(persist(registrationStore, { name: "registration-store" }))
);
