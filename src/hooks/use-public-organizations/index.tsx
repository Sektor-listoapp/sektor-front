import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getCurrentFiltersFromQuery } from "@/utils/organizations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { OperationVariables, QueryHookOptions, useQuery } from "@apollo/client";
import { ALL_ORGANIZATION_TYPES_QUERY } from "@/lib/sektor-api/queries/public/all-organization-types";
import { usePublicOrganizationsStore } from "@/store/public-organizations";

interface UsePublicOrganizationsProps {
  variables?: OperationVariables;
  options?: Omit<QueryHookOptions, "variables">;
}

const usePublicOrganizations = ({
  options,
  variables,
}: UsePublicOrganizationsProps) => {
  const { query } = useRouter();
  const currentFilters = getCurrentFiltersFromQuery(query);

  const { refetch: getPublicOrganizations } = useQuery(
    ALL_ORGANIZATION_TYPES_QUERY,
    {
      skip: true,
      fetchPolicy: "no-cache",
      ...options,
      variables: {
        pagination: { offset: 0, limit: 6 },
        ...currentFilters,
        ...variables,
      },
    }
  );

  const setPublicBrokerageSocieties = usePublicOrganizationsStore(
    (state) => state.setPublicBrokerageSocieties
  );
  const setPublicExclusiveAgents = usePublicOrganizationsStore(
    (state) => state.setPublicExclusiveAgents
  );
  const setPublicInsuranceBrokers = usePublicOrganizationsStore(
    (state) => state.setPublicInsuranceBrokers
  );
  const setPublicInsuranceCompanies = usePublicOrganizationsStore(
    (state) => state.setPublicInsuranceCompanies
  );
  const setPublicSuppliers = usePublicOrganizationsStore(
    (state) => state.setPublicSuppliers
  );
  const setIsLoadingPublicOrganizations = usePublicOrganizationsStore(
    (state) => state.setIsLoadingPublicOrganizations
  );
  const isLoadingPublicOrganizations = usePublicOrganizationsStore(
    (state) => state.isLoadingPublicOrganizations
  );
  const publicOrganizations = usePublicOrganizationsStore(
    (state) => state.publicOrganizations
  );

  /**
   * Fetches public organizations and sets them in the public organizations store.
   */
  const handleGetPublicOrganizations = async () => {
    setIsLoadingPublicOrganizations(true);
    try {
      const organizationsData = await getPublicOrganizations();
      const {
        publicSuppliers = {},
        publicExclusiveAgents = {},
        publicInsuranceBrokers = {},
        publicBrokerageSocieties = {},
        publicInsuranceCompanies = {},
      } = organizationsData?.data;
      setPublicSuppliers(publicSuppliers?.items);
      setPublicExclusiveAgents(publicExclusiveAgents?.items);
      setPublicInsuranceBrokers(publicInsuranceBrokers?.items);
      setPublicBrokerageSocieties(publicBrokerageSocieties?.items);
      setPublicInsuranceCompanies(publicInsuranceCompanies?.items);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    } finally {
      setIsLoadingPublicOrganizations(false);
    }
  };

  return {
    publicOrganizations,
    getPublicOrganizations,
    handleGetPublicOrganizations,
    isLoadingPublicOrganizations,
  };
};

export default usePublicOrganizations;
