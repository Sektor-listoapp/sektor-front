import React from "react";
import { Tabs, TabsProps } from "antd";
import { PUBLIC_INSURANCE_COMPANY_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import OrganizationFlipCard from "../flip-card";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { getTabItems } from "../utils";
import {
  InsuranceCompanyType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import OrganizationSocialMediaLinks from "../organization-social-media-links";
import { getFormattedYearsOfExperience } from "@/utils/formatters";
import OrganizationCoverageLists from "../coverage-lists";
import OrganizationCoverageStates from "../coverage-states/index.tsx";

const InsuranceCompanyDetails = () => {
  const router = useRouter();
  const detailsQuery = router?.query?.details as string;
  const orgId = detailsQuery?.split("-")?.[1] || "";

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<Query>(PUBLIC_INSURANCE_COMPANY_BY_ID_QUERY, {
    variables: { id: orgId },
  });

  const insuranceCompanyData =
    data?.publicInsuranceCompanyById as InsuranceCompanyType;

  const {
    contact,
    name = "",
    motto = "",
    license = "",
    logoUrl = "",
    coverageStates = [],
    foundationYear = 0,
    offices = [],
    lineOfBusiness = [],
  } = insuranceCompanyData || {};

  const yearsOfExperience = getFormattedYearsOfExperience(foundationYear || 0);
  const socialMediaLinks = contact?.links || [];

  const tabComponents = {
    OrganizationCoverageStates: (
      <OrganizationCoverageStates offices={offices} />
    ),
    OrganizationContactLinks: (
      <OrganizationSocialMediaLinks socialMediaLinks={socialMediaLinks} />
    ),
    OrganizationCoverageLists: (
      <OrganizationCoverageLists lineOfBusiness={lineOfBusiness} />
    ),
  };

  const tabItems = getTabItems({
    lineOfBusiness,
    offices,
    coverageStates,
    contactLinks: socialMediaLinks,
  }).map((item) => {
    if (
      !item ||
      !tabComponents[item?.component as keyof typeof tabComponents]
    ) {
      return null;
    }

    return {
      ...item,
      children: tabComponents[item?.component as keyof typeof tabComponents],
    };
  });

  if (error) {
    toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
  }

  if (isLoading) {
    return (
      <div className="my-60 flex items-center justify-center text-blue-500">
        <SektorFullHorizontalLogo className="w-11/12 max-w-40 animate-pulse" />
      </div>
    );
  }

  return (
    <section className="w-full grid grid-cols-6 gap-6 overflow-x-hidden lg:gap-12 lg:p-5 pb-10 lg:pb-16">
      <section className="col-span-6 w-full flex flex-col gap-6 lg:col-span-2">
        <header className="w-full flex flex-col gap-1 text-xl text-blue-500 font-arial-rounded font-semibold md:text-center lg:hidden">
          <h2 className="w-full">{name}</h2>
          <h3 className="w-full text-blue-400">{motto}</h3>
        </header>

        <OrganizationFlipCard
          heading={name}
          logoUrl={logoUrl || "/images/placeholder.png"}
          yearsOfExperience={yearsOfExperience || ""}
        />

        {license && (
          <h3 className="w-full text-blue-500 font-century-gothic font-light text-xl">
            {`#${license}`}
          </h3>
        )}
      </section>

      <div className="col-span-6 w-full lg:col-span-4">
        <header className="hidden lg:flex w-full flex-col gap-1 text-3xl text-blue-500 font-arial-rounded font-semibold mb-4">
          <h2 className="w-full">{name}</h2>
          <h3 className="w-full text-blue-400">{motto}</h3>
        </header>

        <Tabs
          defaultActiveKey="12"
          items={tabItems as TabsProps["items"]}
          className="font-century-gothic !text-blue-500 md:!text-lg lg:!text-2xl active:!text-blue-500"
          color="#182F48"
          tabBarStyle={{ color: "#182F48", borderBottom: "1px solid #B7D9E2" }}
        />
      </div>
    </section>
  );
};

export default InsuranceCompanyDetails;
