import { useQuery } from "@apollo/client";
import { ORGANIZATION_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { Query } from "@/lib/sektor-api/__generated__/types";

export const useOrganizationData = () => {
  const userId = useAuthStore(useShallow((state) => state.user?.id));
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));

  const isCustomer = userGroup === "Customer";

  const {
    data,
    loading,
    error,
  } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: userId },
  
  });

  return {
    organizationData: data?.organizationById,
    loading,
    error,
    isCustomer,
    userId,
    userGroup,
  };
};
