import React from "react";
import { Tabs, TabsProps } from "antd";
import { PUBLIC_SUPPLIER_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import OrganizationsSlider from "../organizations-slider";
import OrganizationFlipCard from "../flip-card";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { getTabItems } from "../utils";
import OrganizationLineOfBusiness from "../line-of-business";
import { Query, SupplierType } from "@/lib/sektor-api/__generated__/types";
import SupplierServices from "../supplier-services";
import { SUPPLIER_SERVICE_TYPE_LABEL } from "./constants";
import OrganizationSocialMediaLinks from "../organization-social-media-links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import OrganizationOfficesSlider from "../offices-slider";

const SupplierDetails = () => {
  const router = useRouter();
  const detailsQuery = router?.query?.details as string;
  const orgId = detailsQuery?.split("-")?.[1] || "";

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<Query>(PUBLIC_SUPPLIER_BY_ID_QUERY, {
    variables: { id: orgId },
    fetchPolicy: "no-cache",
  });

  const supplierData = data?.publicSupplierById as SupplierType;

  const {
    name = "",
    motto = "",
    logoUrl = "",
    offices = [],
    serviceType = "",
    lineOfBusiness = [],
    services = [],
    socialMediaLinks = [],
    insuranceCompanies = [],
  } = supplierData || {};

  const serviceTypeLabel =
    SUPPLIER_SERVICE_TYPE_LABEL[
      serviceType as keyof typeof SUPPLIER_SERVICE_TYPE_LABEL
    ];

  const tabComponents = {
    OrganizationLineOfBusiness: (
      <OrganizationLineOfBusiness lineOfBusiness={lineOfBusiness} />
    ),
    SupplierServices: <SupplierServices services={services} />,
    OrganizationSocialMediaLinks: (
      <OrganizationSocialMediaLinks socialMediaLinks={socialMediaLinks} />
    ),
    OrganizationOfficesSlider: <OrganizationOfficesSlider offices={offices} />,
  };

  const tabItems = getTabItems({
    lineOfBusiness,
    offices,
    services,
    socialMediaLinks,
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
        <header className="w-full flex flex-col gap-2 text-xl text-blue-500 font-century-gothic font-semibold md:text-center lg:hidden">
          <h2 className="w-full">{name}</h2>
          {motto && (
            <h3 className="w-full font-century-gothic font-light text-2xl">
              {motto}
            </h3>
          )}
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{offices?.[0]?.address?.state?.name}</span>
          </div>
        </header>

        <OrganizationFlipCard
          heading={name}
          logoUrl={logoUrl || "/images/placeholder.png"}
          serviceType={serviceTypeLabel || ""}
        />

        <OrganizationsSlider organizations={insuranceCompanies} />
      </section>

      <div className="col-span-6 w-full lg:col-span-4">
        <header className="hidden lg:flex w-full flex-col gap-4 text-3xl text-blue-500 font-century-gothic font-semibold mb-4">
          <h2 className="w-full">{name}</h2>
          {motto && (
            <h3 className="w-full font-century-gothic font-light text-2xl">
              {motto}
            </h3>
          )}

          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{offices?.[0]?.address?.state?.name}</span>
          </div>
        </header>

        <Tabs
          defaultActiveKey="1"
          items={tabItems as TabsProps["items"]}
          className="font-century-gothic !text-blue-500 md:!text-lg lg:!text-2xl active:!text-blue-500"
          color="#182F48"
          tabBarStyle={{ color: "#182F48", borderBottom: "1px solid #B7D9E2" }}
        />
      </div>
    </section>
  );
};

export default SupplierDetails;
