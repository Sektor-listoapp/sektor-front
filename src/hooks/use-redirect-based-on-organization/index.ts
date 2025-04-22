import { UserInfo } from "@/components/auth/login/login-form";
import { ROUTES } from "@/constants/router";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { ORGANIZATION_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const COMPANY_TYPES_REDIRECT = [
  "brokeragesociety",
  "exclusiveagent",
  "insurancebroker",
];

export const useRedirectBasedOnOrganization = (
  userInfo: UserInfo,
  redirectTo?: string
) => {
  const { id, group } = userInfo;
  const { replace } = useRouter();

  
  useEffect(() => {
    if (group === "Admin") {
      replace(redirectTo || ROUTES.HOME);
    }
  }, [group, replace, redirectTo]);

  const { data: organizationDataResponse, error, loading } = useQuery<Query>(
    ORGANIZATION_BY_ID_QUERY,
    {
      variables: { id },
      skip: !id || group === "Admin",
    }
  );

  useEffect(() => {
    if (
      group === "Admin" || 
      !organizationDataResponse?.organizationById ||
      loading ||
      error
    ) {
      return;
    }

    const companyType =
      organizationDataResponse.organizationById.type?.toLowerCase() || "";

    const redirectToQuotes = COMPANY_TYPES_REDIRECT.includes(companyType);

    const targetRoute = redirectToQuotes
      ? redirectTo || ROUTES.MY_QUOTES
      : redirectTo || ROUTES.HOME;

    replace(targetRoute);
  }, [organizationDataResponse, loading, error, redirectTo, replace, group]);
};
