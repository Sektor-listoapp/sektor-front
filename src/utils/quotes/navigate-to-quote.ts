import { ROUTES } from "@/constants/router";
import { USER_TYPES } from "@/constants/shared";
import { UserGroups } from "@/lib/sektor-api/__generated__/types";
import { useAuthStore } from "@/store/auth";
import { NextRouter } from "next/router";

export const canQuoteAsCustomer = (): boolean => {
  const { user, getIsAuthenticated } = useAuthStore.getState();

  return getIsAuthenticated() && user?.group === UserGroups.Customer;
};

export const navigateToQuote = (router: NextRouter, quotePath: string) => {
  if (canQuoteAsCustomer()) {
    router.push(quotePath);
    return;
  }

  router.push({
    pathname: ROUTES.REGISTER,
    query: {
      type: USER_TYPES.CUSTOMER,
      returnUrl: quotePath,
    },
  });
};
