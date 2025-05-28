import { ROUTES } from "@/constants/router";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { ORGANIZATION_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const COMPANY_TYPES_REDIRECT = [
  "brokeragesociety",
  "exclusiveagent",
  "insurancebroker",
];

export const useRedirectBasedOnOrganization = (redirectTo?: string) => {
  const id = useAuthStore(useShallow((state) => state.user?.id));
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const { replace } = useRouter();
  

  const { data: organizationDataResponse, error, loading } = useQuery<Query>(
    ORGANIZATION_BY_ID_QUERY,
    {
      variables: { id },
    }
  );

  useEffect(() => {
    if (loading) return;

  
    if (userGroup === "Admin") {
      replace(redirectTo || ROUTES.HOME);
      return;
    }

  
    if (userGroup === "Customer") {
      replace(redirectTo || ROUTES.HOME);
      return;
    }

  
    if (error || !organizationDataResponse?.organizationById) {
      return;
    }

    const companyType = organizationDataResponse.organizationById.type?.toLowerCase() || "";
console.log('CompanyType', companyType)

    if (COMPANY_TYPES_REDIRECT.includes(companyType)) {
      replace(redirectTo || ROUTES.MY_QUOTES);
      return;
    }

  
    replace(redirectTo || ROUTES.HOME);
  }, [organizationDataResponse, loading, error, redirectTo, replace, userGroup]);
};
