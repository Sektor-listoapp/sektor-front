import {
  AutoQuoteInputType,
  HealthQuoteInputType,
  OtherQuoteInputType,
  PropertyQuoteInputType,
} from "@/lib/sektor-api/__generated__/types";

type QuoteRequestCustomer = {
  name: string | null;
  location: string | null;
  phone: string | null;
  segment: string | null;
};

type QuoteRequest = {
  customer?: QuoteRequestCustomer;
  auto?: Omit<
    AutoQuoteInputType,
    "cityId" | "customer" | "id" | "organizationId"
  >;
  health?: Omit<
    HealthQuoteInputType,
    "cityId" | "customer" | "id" | "organizationId"
  >;
  property?: Omit<
    PropertyQuoteInputType,
    "cityId" | "customer" | "id" | "organizationId"
  >;
  other?: Omit<
    OtherQuoteInputType,
    "cityId" | "customer" | "id" | "organizationId"
  >;
};

export interface QuoteStoreState {
  request: QuoteRequest;
}

export interface QuoteStoreActions {
  setQuoteRequestCustomer: (customer: QuoteRequestCustomer) => void;
  setQuoteRequestAuto: (auto: QuoteRequest["auto"]) => void;
  setQuoteRequestHealth: (health: QuoteRequest["health"]) => void;
  setQuoteRequestProperty: (property: QuoteRequest["property"]) => void;
  setQuoteRequestOther: (other: QuoteRequest["other"]) => void;
  resetQuoteStore: () => void;
}

export type QuoteStore = QuoteStoreState & QuoteStoreActions;

export interface QuoteStoreSetter {
  (
    partial:
      | QuoteStore
      | Partial<QuoteStore>
      | ((state: QuoteStore) => QuoteStore | Partial<QuoteStore>),
    replace?: false | undefined,
    action?: string | undefined
  ): void;
  (
    state: QuoteStore | ((state: QuoteStore) => QuoteStore),
    replace: true,
    action?: string | undefined
  ): void;
}

export type QuoteStoreGetter = () => QuoteStore;
