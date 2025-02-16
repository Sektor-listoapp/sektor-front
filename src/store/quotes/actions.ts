import { initialQuoteStoreState } from "./initial-state";
import { QuoteStoreActions, QuoteStoreSetter } from "./types";

export const quoteStoreActions = (
  set: QuoteStoreSetter
): QuoteStoreActions => ({
  setQuoteRequestCustomer: (customer) => {
    return set(
      (state) => ({
        request: { ...state.request, customer },
      }),
      false,
      "setQuoteRequestCustomer"
    );
  },
  setQuoteRequestAuto: (auto) => {
    return set(
      (state) => ({
        request: { ...state.request, auto },
      }),
      false,
      "setQuoteRequestAuto"
    );
  },
  setQuoteRequestHealth: (health) => {
    return set(
      (state) => ({
        request: { ...state.request, health },
      }),
      false,
      "setQuoteRequestHealth"
    );
  },
  setQuoteRequestProperty: (property) => {
    return set(
      (state) => ({
        request: { ...state.request, property },
      }),
      false,
      "setQuoteRequestProperty"
    );
  },
  setQuoteRequestOther: (other) => {
    return set(
      (state) => ({
        request: { ...state.request, other },
      }),
      false,
      "setQuoteRequestOther"
    );
  },
  resetQuoteStore: () => {
    return set({ ...initialQuoteStoreState }, false, "resetQuoteStore");
  },
});
