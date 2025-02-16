import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { QuoteStore } from "./types";
import { initialQuoteStoreState } from "./initial-state";
import { quoteStoreActions } from "./actions";

const quoteStore: StateCreator<QuoteStore, [["zustand/devtools", never]]> = (
  set
) => ({ ...initialQuoteStoreState, ...quoteStoreActions(set) });

export const useQuoteStore = create<QuoteStore>()(
  devtools(persist(quoteStore, { name: "quote-store" }))
);
