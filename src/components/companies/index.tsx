/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
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
  OrganizationTypes,
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
  sortCompanyListItems,
} from "./types";
import {
  COMPANY_SORT_OPTIONS,
  CompanySortOption,
} from "./constants";
import CompanySortControls from "./company-sort-controls";
import {
  ChangeUserTypeModal,
  ChangeUserTypeTarget,
  useChangeUserType,
} from "./change-user-type";
import { cn } from "@/utils/class-name";

export type CompaniesView = "organizations" | "customers";

const VIEW_TABS: { value: CompaniesView; label: string }[] = [
  { value: "organizations", label: "Empresas" },
  { value: "customers", label: "Personas naturales" },
];

type CompaniesSearchFilter = {
  name?: string;
  email?: string;
  type?: string;
};

// The admin list is fully loaded client-side, so email filtering happens here
// (searchOrganizations / surveyTargetCandidates have no email filter).
const filterByEmail = (items: AdminCompanyListItem[], email?: string) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return items;
  return items.filter((item) =>
    item.email?.toLowerCase().includes(normalizedEmail)
  );
};

const CompanyList = () => {
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<AdminCompanyListItem[]>([]);
  const [searchFilters, setSearchFilters] = useState<CompaniesSearchFilter>({});
  const [companySort, setCompanySort] = useState<CompanySortOption>(
    COMPANY_SORT_OPTIONS.name
  );
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isDeletingOrganization, setIsDeletingOrganization] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] =
    useState<DeleteCompanyTarget | null>(null);
  const [view, setView] = useState<CompaniesView>("organizations");
  const viewRef = useRef<CompaniesView>("organizations");
  const [changeTypeTarget, setChangeTypeTarget] =
    useState<ChangeUserTypeTarget | null>(null);
  const { changeUserType, isChangingUserType } = useChangeUserType();

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
    isChangingUserType ||
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
    const emailFilter = nextFilters.email;
    const selectedType = nextFilters.type?.trim();
    const isCustomerView = viewRef.current === "customers";

    try {
      if (isCustomerView) {
        const candidates = await fetchCustomers(nameFilter);
        const enrichedCustomers = await enrichCustomerCandidates(candidates);
        setCompanies(
          sortCompanyListItems(
            filterByEmail(enrichedCustomers, emailFilter),
            companySort
          )
        );
        return;
      }

      const organizationFilter: Record<string, string> = {};

      if (nameFilter) {
        organizationFilter.name = nameFilter;
      }

      if (selectedType) {
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
      const organizations: OrganizationType[] =
        response?.data?.searchOrganizations?.items || [];

      setCompanies(
        sortCompanyListItems(
          filterByEmail(
            organizations.map(mapOrganizationToListItem),
            emailFilter
          ),
          companySort
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "No se pudo cargar el listado de usuarios, por favor intenta de nuevo más tarde."
      );
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleCompanySortChange = (sort: CompanySortOption) => {
    setCompanySort(sort);
    setCompanies((currentCompanies) =>
      sortCompanyListItems(currentCompanies, sort)
    );
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

  const handleChangeView = (nextView: CompaniesView) => {
    if (nextView === viewRef.current) return;
    viewRef.current = nextView;
    setView(nextView);
    setCompanies([]);
    // CompaniesHeader re-runs the search with whatever is typed when the view changes.
  };

  const handleConvertCustomer = ({ id, name }: AdminCompanyListItem) =>
    setChangeTypeTarget({
      id,
      name,
      currentType: UserGroups.Customer,
      newType: OrganizationTypes.InsuranceBroker,
    });

  const handleConfirmChangeType = async ({
    id,
    newType,
  }: ChangeUserTypeTarget) => {
    const ok = await changeUserType(id, newType);
    if (!ok) return;
    setChangeTypeTarget(null);
    handleGetCompanies();
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
        <nav
          role="tablist"
          aria-label="Tipo de listado"
          className="w-full max-w-xl xl:max-w-full flex gap-2 border-b border-blue-500/30"
        >
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={view === tab.value}
              disabled={isLoadingCompanies}
              onClick={() => handleChangeView(tab.value)}
              className={cn(
                "px-4 py-2 -mb-px font-century-gothic text-sm md:text-base border-b-2 transition-colors",
                view === tab.value
                  ? "border-blue-500 font-bold text-blue-500"
                  : "border-transparent text-blue-500/60 hover:text-blue-500"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <CompaniesHeader
          view={view}
          handleGetCompanies={handleGetCompanies}
          searchFilters={searchFilters}
          disabled={
            isLoadingCompanies ||
            isChangingVisibility ||
            isChangingPlan ||
            isChangingUserType
          }
        />

        <CompanySortControls
          value={companySort}
          onChange={handleCompanySortChange}
          disabled={isLoadingCompanies}
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
              onConvertToBroker={handleConvertCustomer}
              disabled={disableActions}
              countryStates={countryStates}
              changeOrgPlan={handleChangeOrgPlan}
              changeOrgVisibility={handleChangeOrgVisibility}
              setOpenDeleteModal={setOpenDeleteModal}
            />
            <CompaniesAccordion
              data={companies}
              onConvertToBroker={handleConvertCustomer}
              disabled={disableActions}
              countryStates={countryStates}
              changeOrgPlan={handleChangeOrgPlan}
              changeOrgVisibility={handleChangeOrgVisibility}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          </>
        )}
      </section>
      <ChangeUserTypeModal
        target={changeTypeTarget}
        onClose={() => setChangeTypeTarget(null)}
        onConfirm={handleConfirmChangeType}
        loading={isChangingUserType}
      />
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
