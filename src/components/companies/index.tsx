/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  COUNTRY_BY_CODE_QUERY,
  SEARCH_ORGANIZATIONS,
} from "@/lib/sektor-api/queries";
import {
  Mutation,
  OrganizationPlans,
  OrganizationType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import CompaniesTable from "./table";
import {
  CHANGE_ORGANIZATION_PLAN,
  CHANGE_ORGANIZATION_VISIBILITY,
} from "@/lib/sektor-api/mutations";
import { toast } from "react-toastify";
import CompaniesAccordion from "./accordion";
import CompaniesHeader from "./header";
import NoCompanies from "./no-companies";
import SektorFullVerticalLogo from "../icons/sektor-full-vertical-logo";

const CompanyList = () => {
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<OrganizationType[]>([]);
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const [changeOrgVisibility] = useMutation<Mutation>(
    CHANGE_ORGANIZATION_VISIBILITY
  );
  const [changeOrgPlan] = useMutation<Mutation>(CHANGE_ORGANIZATION_PLAN);

  const defaultVariables = { pagination: { offset: 0, limit: 10000 } };
  const { error: companiesError, refetch: getCompanies } = useQuery<Query>(
    SEARCH_ORGANIZATIONS,
    {
      variables: defaultVariables,
      fetchPolicy: "no-cache",
    }
  );

  const { data: countryDataResponse, loading: isLoadingCountryData } =
    useQuery<Query>(COUNTRY_BY_CODE_QUERY, { variables: { code: "VE" } });
  const countryStates = countryDataResponse?.getCountryByCode?.states || [];

  const disableActions =
    isLoadingCompanies ||
    isChangingVisibility ||
    isChangingPlan ||
    isLoadingCountryData;

  const handleGetCompanies = (variables = {}) => {
    setIsLoadingCompanies(true);
    const hasVariables = Object.keys(variables).length > 0;
    const queryVariables = hasVariables ? variables : defaultVariables;
    getCompanies(queryVariables)
      .then((res) => setCompanies(res?.data?.searchOrganizations?.items || []))
      .catch((e) => console.log(e))
      .finally(() => setIsLoadingCompanies(false));
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
    <section className="bg-white w-full py-5 md:py-10 flex flex-col items-center justify-center gap-10 xl:shadow-2xl rounded-xl xl:px-10">
      <CompaniesHeader
        handleGetCompanies={handleGetCompanies}
        disabled={isLoadingCompanies || isChangingVisibility || isChangingPlan}
      />

      {isLoadingCompanies && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-40 z-50">
          <SektorFullVerticalLogo className="w-32 animate-pulse" />
        </div>
      )}

      {!companies?.length && !isLoadingCompanies && <NoCompanies />}

      <CompaniesTable
        data={companies}
        disabled={disableActions}
        countryStates={countryStates}
        changeOrgPlan={handleChangeOrgPlan}
        changeOrgVisibility={handleChangeOrgVisibility}
      />

      <CompaniesAccordion
        data={companies}
        disabled={disableActions}
        countryStates={countryStates}
        changeOrgPlan={handleChangeOrgPlan}
        changeOrgVisibility={handleChangeOrgVisibility}
      />
    </section>
  );
};

export default CompanyList;
