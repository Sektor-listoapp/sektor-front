import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";
import { ROUTES } from "@/constants/router";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { PROFILE_QUERY } from "@/lib/sektor-api/queries";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";

const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const resetAuthStore = useAuthStore((state) => state.resetAuthStore);

    const {
      data: profileResponse,
      loading,
      error,
    } = useQuery<Query>(PROFILE_QUERY, {
      fetchPolicy: "no-cache",
    });

    if (!loading && (!profileResponse?.profile || error)) {
      resetAuthStore();
      router.push({
        pathname: ROUTES.LOGIN,
        query: { redirectTo: router.asPath },
      });
      return null;
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <SektorFullVerticalLogo className="animate-pulse transition-all w-28 text-blue-500" />
        </div>
      );
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
