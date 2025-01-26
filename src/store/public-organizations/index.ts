import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

import { publicRegistrationsStoreActions } from "./actions";
import { PublicOrganizationsStore } from "./types";
import { initialPublicOrganizationsStoreState } from "./initial-state";

const publicOrganizationsStore: StateCreator<
  PublicOrganizationsStore,
  [["zustand/devtools", never]]
> = (set) => ({
  ...initialPublicOrganizationsStoreState,
  ...publicRegistrationsStoreActions(set),
});

export const usePublicOrganizationsStore = create<PublicOrganizationsStore>()(
  devtools(publicOrganizationsStore, { name: "public-organizations-store" })
);
