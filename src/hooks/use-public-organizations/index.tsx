import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getCurrentFiltersFromQuery } from "@/utils/organizations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { OperationVariables, QueryHookOptions, useQuery } from "@apollo/client";
import { ALL_ORGANIZATION_TYPES_QUERY } from "@/lib/sektor-api/queries/public/all-organization-types";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { ParsedUrlQuery } from "querystring";
import { OrganizationPaginationInfo } from "@/types/public";

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

  const setPublicOrganizations = (data: Query, currentPage = 1) => {
    const getPaginationInfo = (
      paginatedData: { count?: number; pages?: number } | null | undefined
    ): OrganizationPaginationInfo | null => {
      if (!paginatedData || paginatedData.count === undefined || paginatedData.pages === undefined) {
        return null;
      }
      return {
        count: paginatedData.count,
        pages: paginatedData.pages,
        currentPage,
      };
    };

    setPublicSuppliers(
      data?.publicSuppliers?.items || [],
      getPaginationInfo(data?.publicSuppliers)
    );
    setPublicExclusiveAgents(
      data?.publicExclusiveAgents?.items || [],
      getPaginationInfo(data?.publicExclusiveAgents)
    );
    setPublicInsuranceBrokers(
      data?.publicInsuranceBrokers?.items || [],
      getPaginationInfo(data?.publicInsuranceBrokers)
    );
    setPublicBrokerageSocieties(
      data?.publicBrokerageSocieties?.items || [],
      getPaginationInfo(data?.publicBrokerageSocieties)
    );
    setPublicInsuranceCompanies(
      data?.publicInsuranceCompanies?.items || [],
      getPaginationInfo(data?.publicInsuranceCompanies)
    );
  };

  const handleGetPublicOrganizations = async () => {
    setIsLoadingPublicOrganizations(true);

    const updatedFilters = getCurrentFiltersFromQuery(query);

    const variablesToSend = {
      pagination: { offset: 0, limit: 6 },
      ...updatedFilters,
      ...variables,
    };

    try {
      const { data } = await getPublicOrganizations(variablesToSend);
      setPublicOrganizations(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      console.error('Error fetching public organizations:', error);
      toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    } finally {
      setIsLoadingPublicOrganizations(false);
    }
  };

  const handleGetPublicOrganizationsWithNewFilters = async (
    query?: ParsedUrlQuery,
    limit = 6,
    page = 1
  ) => {
    const currentFilters = getCurrentFiltersFromQuery(query ?? {});
    setIsLoadingPublicOrganizations(true);

    const offset = (page - 1) * limit;
    const variablesToSend = {
      pagination: { offset, limit },
      ...currentFilters,
    };

    try {
      const { data } = await getPublicOrganizations(variablesToSend);
      if (data) {
        setPublicSuppliers([], null);
        setPublicExclusiveAgents([], null);
        setPublicInsuranceBrokers([], null);
        setPublicBrokerageSocieties([], null);
        setPublicInsuranceCompanies([], null);
        setPublicOrganizations(data, page);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    } finally {
      setIsLoadingPublicOrganizations(false);
    }
  };

  const handleChangePage = async (
    organizationType: string,
    page: number,
    limit = 12
  ) => {
    const currentFilters = getCurrentFiltersFromQuery(query);
    setIsLoadingPublicOrganizations(true);
    const offset = (page - 1) * limit;
    const variablesToSend = {
      pagination: { offset, limit },
      ...currentFilters,
    };

    try {
      const { data } = await getPublicOrganizations(variablesToSend);

      const getPaginationInfo = (
        paginatedData: { count?: number; pages?: number } | null | undefined
      ): OrganizationPaginationInfo | null => {
        if (!paginatedData || paginatedData.count === undefined || paginatedData.pages === undefined) {
          return null;
        }
        return {
          count: paginatedData.count,
          pages: paginatedData.pages,
          currentPage: page,
        };
      };

      switch (organizationType) {
        case "supplier":
          setPublicSuppliers(
            data?.publicSuppliers?.items || [],
            getPaginationInfo(data?.publicSuppliers)
          );
          break;
        case "exclusiveAgent":
          setPublicExclusiveAgents(
            data?.publicExclusiveAgents?.items || [],
            getPaginationInfo(data?.publicExclusiveAgents)
          );
          break;
        case "insuranceBroker":
          setPublicInsuranceBrokers(
            data?.publicInsuranceBrokers?.items || [],
            getPaginationInfo(data?.publicInsuranceBrokers)
          );
          break;
        case "brokerageSociety":
          setPublicBrokerageSocieties(
            data?.publicBrokerageSocieties?.items || [],
            getPaginationInfo(data?.publicBrokerageSocieties)
          );
          break;
        case "insuranceCompany":
          setPublicInsuranceCompanies(
            data?.publicInsuranceCompanies?.items || [],
            getPaginationInfo(data?.publicInsuranceCompanies)
          );
          break;
      }
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
      const variablesToSend = {
        pagination: { offset: 0, limit: 6 },
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

  return {
    publicOrganizations,
    getPublicOrganizations,
    handleGetPublicOrganizations,
    isLoadingPublicOrganizations,
    handleGetPublicOrganizationsWithNewFilters,
    handleGetPublicOrganizationsWithoutFilters,
    handleChangePage,
  };
};

export default usePublicOrganizations;
