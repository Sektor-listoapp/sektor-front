/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  COUNTRY_BY_CODE_QUERY,
  CUSTOMER_BY_ID_QUERY,
  LIST_CUSTOMERS_FOR_ADMIN,
  SEARCH_ORGANIZATIONS,
} from "@/lib/sektor-api/queries";
import {
  Mutation,
  OrganizationPlans,
  OrganizationType,
  Query,
  SurveyTarget,
  SurveyTargetCandidateType,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import CompaniesTable from "./table";
import {
  ADMIN_DELETE_USER,
  CHANGE_ORGANIZATION_PLAN,
  CHANGE_ORGANIZATION_VISIBILITY,
  DELETE_ORGANIZATION,
} from "@/lib/sektor-api/mutations";
import { toast } from "react-toastify";
import CompaniesAccordion from "./accordion";
import CompaniesHeader from "./header";
import NoCompanies from "./no-companies";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import DeleteOrgModal from "./delete-org-modal";
import {
  AdminCompanyListItem,
  DeleteCompanyTarget,
  mapOrganizationToListItem,
  mapSurveyTargetCandidateToListItem,
  sortCustomerListItems,
} from "./types";
import {
  CUSTOMER_SORT_OPTIONS,
  CustomerSortOption,
} from "./constants";
import CustomerSortControls from "./customer-sort-controls";

const CUSTOMER_FILTER_TYPE = UserGroups.Customer;

type CompaniesSearchFilter = {
  name?: string;
  type?: string;
};

const CompanyList = () => {
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<AdminCompanyListItem[]>([]);
  const [searchFilters, setSearchFilters] = useState<CompaniesSearchFilter>({});
  const [customerSort, setCustomerSort] = useState<CustomerSortOption>(
    CUSTOMER_SORT_OPTIONS.name
  );
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isDeletingOrganization, setIsDeletingOrganization] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] =
    useState<DeleteCompanyTarget | null>(null);

  const [changeOrgVisibility] = useMutation<Mutation>(
    CHANGE_ORGANIZATION_VISIBILITY
  );
  const [changeOrgPlan] = useMutation<Mutation>(CHANGE_ORGANIZATION_PLAN);
  const [deleteOrganization] = useMutation<Mutation>(DELETE_ORGANIZATION);
  const [deleteUser] = useMutation<Mutation>(ADMIN_DELETE_USER);

  const [getOrganizations, { error: companiesError }] = useLazyQuery<Query>(
    SEARCH_ORGANIZATIONS,
    { fetchPolicy: "no-cache" }
  );

  const [getCustomers] = useLazyQuery<{
    surveyTargetCandidates: SurveyTargetCandidateType[];
  }>(LIST_CUSTOMERS_FOR_ADMIN, { fetchPolicy: "no-cache" });

  const [getCustomerById] = useLazyQuery<Query>(CUSTOMER_BY_ID_QUERY, {
    fetchPolicy: "no-cache",
  });

  const { data: countryDataResponse, loading: isLoadingCountryData } =
    useQuery<Query>(COUNTRY_BY_CODE_QUERY, { variables: { code: "VE" } });
  const countryStates = countryDataResponse?.getCountryByCode?.states || [];

  const disableActions =
    isLoadingCompanies ||
    isChangingVisibility ||
    isChangingPlan ||
    isLoadingCountryData;

  const enrichCustomerCandidates = async (
    candidates: SurveyTargetCandidateType[]
  ) => {
    return Promise.all(
      candidates.map(async (candidate) => {
        try {
          const { data } = await getCustomerById({
            variables: { id: candidate.id },
          });

          return mapSurveyTargetCandidateToListItem(
            candidate,
            data?.customerById
          );
        } catch {
          return mapSurveyTargetCandidateToListItem(candidate);
        }
      })
    );
  };

  const fetchCustomers = async (name?: string) => {
    try {
      const { data, error } = await getCustomers({
        variables: { targetTypes: [SurveyTarget.Customer] },
      });

      if (error) {
        throw error;
      }

      const normalizedName = name?.trim().toLowerCase();

      return (data?.surveyTargetCandidates ?? []).filter((candidate) => {
        if (!normalizedName) {
          return true;
        }

        return candidate.name.toLowerCase().includes(normalizedName);
      });
    } catch (error) {
      console.error(error);
      toast.error(
        "No se pudo cargar el listado de personas naturales, por favor intenta de nuevo más tarde."
      );
      return [];
    }
  };

  const handleGetCompanies = async (
    variables: { filter?: CompaniesSearchFilter } = {}
  ) => {
    setIsLoadingCompanies(true);

    const nextFilters =
      variables.filter !== undefined ? variables.filter : searchFilters;

    if (variables.filter !== undefined) {
      setSearchFilters(variables.filter);
    }

    const nameFilter = nextFilters.name?.trim();
    const selectedType = nextFilters.type?.trim();
    const isCustomerFilter = selectedType === CUSTOMER_FILTER_TYPE;
    const shouldFetchOrganizations = !isCustomerFilter;
    const shouldFetchCustomers = !selectedType || isCustomerFilter;
    const activeCustomerSort = isCustomerFilter ? customerSort : CUSTOMER_SORT_OPTIONS.name;

    if (variables.filter !== undefined && !isCustomerFilter) {
      setCustomerSort(CUSTOMER_SORT_OPTIONS.name);
    }

    try {
      let organizations: OrganizationType[] = [];
      let customers: SurveyTargetCandidateType[] = [];

      if (shouldFetchOrganizations) {
        const organizationFilter: Record<string, string> = {};

        if (nameFilter) {
          organizationFilter.name = nameFilter;
        }

        if (selectedType && !isCustomerFilter) {
          organizationFilter.type = selectedType;
        }

        const response = await getOrganizations({
          variables: {
            pagination: { offset: 0, limit: 10000 },
            filter:
              Object.keys(organizationFilter).length > 0
                ? organizationFilter
                : null,
          },
        });
        organizations = response?.data?.searchOrganizations?.items || [];
      }

      if (shouldFetchCustomers) {
        const candidates = await fetchCustomers(nameFilter);

        if (isCustomerFilter) {
          const enrichedCustomers = await enrichCustomerCandidates(candidates);
          setCompanies(sortCustomerListItems(enrichedCustomers, activeCustomerSort));
          return;
        }

        customers = candidates;
      }

      const mergedCompanies = [
        ...organizations.map(mapOrganizationToListItem),
        ...customers.map((candidate) => mapSurveyTargetCandidateToListItem(candidate)),
      ].sort((a, b) => a.name.localeCompare(b.name, "es"));

      setCompanies(mergedCompanies);
    } catch (error) {
      console.error(error);
      toast.error(
        "No se pudo cargar el listado de usuarios, por favor intenta de nuevo más tarde."
      );
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleCustomerSortChange = (sort: CustomerSortOption) => {
    setCustomerSort(sort);

    if (searchFilters.type !== CUSTOMER_FILTER_TYPE) {
      return;
    }

    setCompanies((currentCompanies) => sortCustomerListItems(currentCompanies, sort));
  };

  const handleChangeOrgPlan = (id: string, plan: OrganizationPlans) => {
    setIsChangingPlan(true);
    changeOrgPlan({ variables: { input: { id, plan } } })
      .then(() => handleGetCompanies())
      .catch(() => {
        toast.error(
          "No se pudo cambiar el plan de la empresa, por favor intenta de nuevo más tarde."
        );
      })
      .finally(() => setIsChangingPlan(false));
  };

  const handleDeleteCompany = ({ id, isCustomer }: DeleteCompanyTarget) => {
    setIsDeletingOrganization(true);

    const deletePromise = isCustomer
      ? deleteUser({ variables: { userId: id } })
      : deleteOrganization({ variables: { id } });

    deletePromise
      .then(() => {
        setOpenDeleteModal(null);
        toast.success(
          isCustomer
            ? "Persona natural eliminada correctamente."
            : "Empresa eliminada correctamente."
        );
        handleGetCompanies();
      })
      .catch(() => {
        toast.error(
          isCustomer
            ? "No se pudo eliminar la persona natural, por favor intenta de nuevo más tarde."
            : "No se pudo eliminar la empresa, por favor intenta de nuevo más tarde."
        );
      })
      .finally(() => setIsDeletingOrganization(false));
  };

  const handleChangeOrgVisibility = (id: string, isActive: boolean) => {
    setIsChangingVisibility(true);
    changeOrgVisibility({ variables: { input: { id, isActive } } })
      .then(() => handleGetCompanies())
      .catch(() => {
        toast.error(
          "No se pudo cambiar la visibilidad de la empresa, por favor intenta de nuevo más tarde."
        );
      })
      .finally(() => setIsChangingVisibility(false));
  };

  useEffect(() => {
    handleGetCompanies();
  }, []);

  if (companiesError) {
    return <NoCompanies companiesError={true} />;
  }

  return (
    <>
      <section className="bg-white w-full py-5 md:py-10 flex flex-col items-center justify-center gap-10 xl:shadow-2xl rounded-xl xl:px-10">
        <CompaniesHeader
          handleGetCompanies={handleGetCompanies}
          searchFilters={searchFilters}
          disabled={
            isLoadingCompanies || isChangingVisibility || isChangingPlan
          }
        />

        {searchFilters.type === CUSTOMER_FILTER_TYPE && (
          <CustomerSortControls
            value={customerSort}
            onChange={handleCustomerSortChange}
            disabled={isLoadingCompanies}
          />
        )}

        {isLoadingCompanies && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-40 z-50">
            <FullScreenLoaderLogo className="w-32" />
          </div>
        )}

        {!companies?.length && !isLoadingCompanies ? (
          <NoCompanies />
        ) : (
          <>
            <CompaniesTable
              data={companies}
              disabled={disableActions}
              countryStates={countryStates}
              changeOrgPlan={handleChangeOrgPlan}
              changeOrgVisibility={handleChangeOrgVisibility}
              setOpenDeleteModal={setOpenDeleteModal}
            />
            <CompaniesAccordion
              data={companies}
              disabled={disableActions}
              countryStates={countryStates}
              changeOrgPlan={handleChangeOrgPlan}
              changeOrgVisibility={handleChangeOrgVisibility}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          </>
        )}
      </section>
      <DeleteOrgModal
        target={openDeleteModal}
        setOpen={setOpenDeleteModal}
        open={Boolean(openDeleteModal)}
        handleDeleteCompany={handleDeleteCompany}
        isDeletingOrganization={isDeletingOrganization}
      />
    </>
  );
};

export default CompanyList;
