import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getCurrentFiltersFromQuery } from "@/utils/organizations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { OperationVariables, QueryHookOptions, useQuery } from "@apollo/client";
import { ALL_ORGANIZATION_TYPES_QUERY } from "@/lib/sektor-api/queries/public/all-organization-types";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { ParsedUrlQuery } from "querystring";

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

  const { refetch: getPublicOrganizations } = useQuery<Query>(
    ALL_ORGANIZATION_TYPES_QUERY,
    {
      skip: true,
      fetchPolicy: "no-cache",
      ...options,
      variables: {
        pagination: { offset: 0, limit: 6 },
        ...currentFilters,
        state: "Distrito Capital",
        city: "Caracas",
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

  const setPublicOrganizations = (data: Query) => {
    setPublicSuppliers(data?.publicSuppliers?.items || []);
    setPublicExclusiveAgents(data?.publicExclusiveAgents?.items || []);
    setPublicInsuranceBrokers(data?.publicInsuranceBrokers?.items || []);
    setPublicBrokerageSocieties(data?.publicBrokerageSocieties?.items || []);
    setPublicInsuranceCompanies(data?.publicInsuranceCompanies?.items || []);
  };

  const handleGetPublicOrganizations = async () => {
    setIsLoadingPublicOrganizations(true);
    try {

      const updatedFilters = getCurrentFiltersFromQuery(query);


      const variablesToSend = {
        pagination: { offset: 0, limit: 6 },
        ...updatedFilters,
        state: "Distrito Capital",
        city: "Caracas",
        ...variables,
      };



      const { data } = await getPublicOrganizations(variablesToSend);

  

      setPublicOrganizations(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    } finally {
      setIsLoadingPublicOrganizations(false);
    }
  };

  const handleGetPublicOrganizationsWithNewFilters = async (
    query?: ParsedUrlQuery,
    limit = 6
  ) => {
    const currentFilters = getCurrentFiltersFromQuery(query ?? {});
    setIsLoadingPublicOrganizations(true);
    try {
      const variablesToSend = {
        pagination: { offset: 0, limit },
        ...currentFilters,
      };


      const { data } = await getPublicOrganizations(variablesToSend);



      setPublicOrganizations(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    } finally {
      setIsLoadingPublicOrganizations(false);
    }
  };

  const handleGetPublicOrganizationsWithoutFilters = async () => {
    setIsLoadingPublicOrganizations(true);
    try {
      const { data } = await getPublicOrganizations({
        pagination: { offset: 0, limit: 6 },
        ...{},
      });
      setPublicOrganizations(data);
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
    handleGetPublicOrganizationsWithNewFilters,
    handleGetPublicOrganizationsWithoutFilters,
  };
};

export default usePublicOrganizations;
