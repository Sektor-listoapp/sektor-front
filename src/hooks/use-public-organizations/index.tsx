import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { buildOrganizationQueryVariables } from "@/utils/organizations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { OperationVariables, QueryHookOptions, useQuery } from "@apollo/client";
import { ALL_ORGANIZATION_TYPES_QUERY } from "@/lib/sektor-api/queries/public/all-organization-types";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { ParsedUrlQuery } from "querystring";
import { OrganizationPaginationInfo } from "@/types/public";

type AllOrganizationsQueryResult = Query & {
  workshops?: Query["publicSuppliers"];
};

interface UsePublicOrganizationsProps {
  variables?: OperationVariables;
  options?: Omit<QueryHookOptions, "variables">;
}

const usePublicOrganizations = ({
  options,
  variables,
}: UsePublicOrganizationsProps) => {
  const { query } = useRouter();

  const { refetch: getPublicOrganizations } = useQuery<Query>(
    ALL_ORGANIZATION_TYPES_QUERY,
    {
      skip: true,
      fetchPolicy: "no-cache",
      errorPolicy: "all",
      ...options,
      variables: buildOrganizationQueryVariables(query, {
        offset: 0,
        limit: 6,
      }, variables),
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
  const setPublicWorkshops = usePublicOrganizationsStore(
    (state) => state.setPublicWorkshops
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

  const setPublicOrganizations = (data: AllOrganizationsQueryResult, currentPage = 1) => {
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
    setPublicWorkshops(
      data?.workshops?.items || [],
      getPaginationInfo(data?.workshops)
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

    const variablesToSend = buildOrganizationQueryVariables(query, {
      offset: 0,
      limit: 6,
    }, variables);

    try {
      const { data, errors } = await getPublicOrganizations(variablesToSend);
      if (data) setPublicOrganizations(data);
      if (errors?.length) {
        console.error("GraphQL errors fetching public organizations:", errors);
      }
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
    setIsLoadingPublicOrganizations(true);

    const offset = (page - 1) * limit;
    const variablesToSend = buildOrganizationQueryVariables(query ?? {}, {
      offset,
      limit,
    });

    try {
      const { data, errors } = await getPublicOrganizations(variablesToSend);
      if (data) {
        setPublicSuppliers([], null);
        setPublicWorkshops([], null);
        setPublicExclusiveAgents([], null);
        setPublicInsuranceBrokers([], null);
        setPublicBrokerageSocieties([], null);
        setPublicInsuranceCompanies([], null);
        setPublicOrganizations(data, page);
      }
      if (errors?.length) {
        console.error("GraphQL errors fetching public organizations:", errors);
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
    setIsLoadingPublicOrganizations(true);
    const offset = (page - 1) * limit;
    const variablesToSend = buildOrganizationQueryVariables(query, {
      offset,
      limit,
    });

    try {
      const { data, errors } = await getPublicOrganizations(variablesToSend);
      const queryData = data as AllOrganizationsQueryResult | undefined;

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
            queryData?.publicSuppliers?.items || [],
            getPaginationInfo(queryData?.publicSuppliers)
          );
          break;
        case "workshop":
          setPublicWorkshops(
            queryData?.workshops?.items || [],
            getPaginationInfo(queryData?.workshops)
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
      if (errors?.length) {
        console.error("GraphQL errors fetching public organizations:", errors);
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
      const variablesToSend = buildOrganizationQueryVariables({}, {
        offset: 0,
        limit: 6,
      });
      const { data, errors } = await getPublicOrganizations(variablesToSend);
      if (data) {
        setPublicSuppliers([], null);
        setPublicWorkshops([], null);
        setPublicExclusiveAgents([], null);
        setPublicInsuranceBrokers([], null);
        setPublicBrokerageSocieties([], null);
        setPublicInsuranceCompanies([], null);
        setPublicOrganizations(data);
      }
      if (errors?.length) {
        console.error("GraphQL errors fetching public organizations:", errors);
      }
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
