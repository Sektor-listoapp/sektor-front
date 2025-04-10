import {
  BrokerageSocietyType,
  ExclusiveAgentType,
  InsuranceBrokerType,
  InsuranceCompanyType,
  PublicOrganizationType,
  SupplierType,
} from "@/lib/sektor-api/__generated__/types";
import { NextRouter } from "next/router";

interface ShowOrganizationDetailsParams {
  router: NextRouter;
  data:
    | SupplierType
    | ExclusiveAgentType
    | InsuranceBrokerType
    | InsuranceCompanyType
    | BrokerageSocietyType
    | PublicOrganizationType;
}

export const showOrganizationDetails = ({
  router,
  data,
}: ShowOrganizationDetailsParams) => {
  const { replace, query, pathname } = router;
  const { id, type } = data;

  replace(
    { pathname, query: { ...query, details: `${type}-${id}` } },
    undefined,
    { scroll: false }
  );
};
