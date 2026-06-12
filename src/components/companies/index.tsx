/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  COUNTRY_BY_CODE_QUERY,
  SEARCH_CUSTOMERS,
  SEARCH_ORGANIZATIONS,
} from "@/lib/sektor-api/queries";
import {
  CustomerType,
  Mutation,
  OrganizationPlans,
  OrganizationType,
  Query,
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
  mapCustomerToListItem,
  mapOrganizationToListItem,
} from "./types";

const CompanyList = () => {
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<AdminCompanyListItem[]>([]);
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

  const [getCustomers] = useLazyQuery<Query>(SEARCH_CUSTOMERS, {
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

  const fetchCustomers = async (name?: string) => {
    try {
      const { data } = await getCustomers({
        variables: {
          pagination: { offset: 0, limit: 10000 },
          filter: name ? { name } : undefined,
        },
      });

      const customerItems = (
        data as { searchCustomers?: { items?: CustomerType[] } } | undefined
      )?.searchCustomers?.items;

      return customerItems ?? [];
    } catch {
      return [];
    }
  };

  const handleGetCompanies = async (variables: Record<string, unknown> = {}) => {
    setIsLoadingCompanies(true);

    const filter = (variables.filter ?? {}) as {
      name?: string;
      type?: string;
    };
    const selectedType = filter.type;
    const nameFilter = filter.name?.trim();
    const isCustomerFilter = selectedType === UserGroups.Customer;
    const shouldFetchOrganizations =
      !selectedType || (!isCustomerFilter && Boolean(selectedType));
    const shouldFetchCustomers = !selectedType || isCustomerFilter;

    try {
      let organizations: OrganizationType[] = [];
      let customers: CustomerType[] = [];

      if (shouldFetchOrganizations) {
        const organizationVariables = {
          pagination: { offset: 0, limit: 10000 },
          ...(Object.keys(filter).length
            ? {
                filter: {
                  ...(nameFilter ? { name: nameFilter } : {}),
                  ...(selectedType && !isCustomerFilter
                    ? { type: selectedType }
                    : {}),
                },
              }
            : {}),
        };

        const response = await getOrganizations({
          variables: organizationVariables,
        });
        organizations = response?.data?.searchOrganizations?.items || [];
      }

      if (shouldFetchCustomers) {
        customers = await fetchCustomers(nameFilter);
      }

      const mergedCompanies = [
        ...organizations.map(mapOrganizationToListItem),
        ...customers.map(mapCustomerToListItem),
      ].sort((a, b) => a.name.localeCompare(b.name, "es"));

      setCompanies(mergedCompanies);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCompanies(false);
    }
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
          disabled={
            isLoadingCompanies || isChangingVisibility || isChangingPlan
          }
        />

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
