import React, { useState } from "react";
import Button from "@/components/ui/button";
import { Tabs, TabsProps } from "antd";
import OrganizationModality from "../modality";
import OrganizationFlipCard from "../flip-card";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { getTabItems } from "../utils";
import OrganizationRecognitions from "../recognitions";
import OrganizationPartners from "../partners";
import OrganizationLineOfBusiness from "../line-of-business";
import { getFormattedYearsOfExperience } from "@/utils/formatters";
import {
  ExclusiveAgentType,
  OrganizationPlans,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { PUBLIC_EXCLUSIVE_AGENT_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Image from "next/image";
import { ROUTES } from "@/constants/router";
import ContactDetailsModal from "../contact-details-modal";

const ExclusiveAgentDetails = () => {
  const router = useRouter();
  const detailsQuery = router?.query?.details as string;
  const orgId = detailsQuery?.split("-")?.[1] || "";

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<Query>(PUBLIC_EXCLUSIVE_AGENT_BY_ID_QUERY, {
    variables: { id: orgId },
    fetchPolicy: "no-cache",
  });

  const exclusiveAgentData =
    data?.publicExclusiveAgentById as ExclusiveAgentType;

  const {
    name = "",
    modality = "",
    logoUrl = "",
    license = "",
    foundationYear = 0,
    address,
    clients = [],
    recognitions = [],
    lineOfBusiness = [],
    insuranceCompanies = [],
    allies = [],
    plan,
  } = exclusiveAgentData || {};

  const isPremium = plan === OrganizationPlans.Premium;
  const stateName = address?.state?.name || "";
  const heading = `${name}${stateName ? `, ${stateName}` : ""}`;
  const yearsOfExperience = getFormattedYearsOfExperience(foundationYear || 0);
  const organizationLogoUrl = insuranceCompanies?.[0]?.logoUrl;
  const [openContactDetailsModal, setOpenContactDetailsModal] = useState(false);

  const tabComponents = {
    OrganizationLineOfBusiness: (
      <OrganizationLineOfBusiness lineOfBusiness={lineOfBusiness} />
    ),
    OrganizationClients: <OrganizationPartners partners={clients} />,
    OrganizationAllies: <OrganizationPartners partners={allies} />,
    OrganizationRecognitions: (
      <OrganizationRecognitions recognitions={recognitions} />
    ),
  };
  const tabItems = getTabItems({
    lineOfBusiness,
    clients,
    allies,
    recognitions,
  }).map((item) => {
    if (!item || !tabComponents[item?.component as keyof typeof tabComponents])
      return null;

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
    <section className="w-full grid grid-cols-6 gap-6 overflow-x-hidden lg:gap-12 lg:p-5 lg:pb-10">
      <section className="col-span-6 w-full flex flex-col gap-6 lg:col-span-2">
        <header className="w-full flex flex-col gap-2 text-xl text-blue-500 font-century-gothic font-semibold md:text-center lg:hidden">
          <h2 className="w-full">{heading}</h2>
          {modality && (
            <OrganizationModality
              modality={modality}
              className="md:justify-center"
            />
          )}
        </header>

        <OrganizationFlipCard
          heading={heading}
          license={license || ""}
          logoUrl={logoUrl || "/images/placeholder.png"}
          yearsOfExperience={yearsOfExperience || ""}
        />

        <div className="w-full mx-auto flex justify-center items-center">
          <Image
            src={organizationLogoUrl || "/images/placeholder.png"}
            alt={name}
            width={200}
            height={100}
          />
        </div>

        <Button
          variant="link-blue"
          className="w-fit"
          onClick={() => setOpenContactDetailsModal(true)}
        >
          Ver contacto
        </Button>
        <ContactDetailsModal
          contact={exclusiveAgentData}
          open={openContactDetailsModal}
          setOpen={setOpenContactDetailsModal}
        />
      </section>

      <div className="col-span-6 w-full lg:col-span-4">
        <header className="hidden lg:flex w-full flex-col gap-4 text-3xl text-blue-500 font-century-gothic font-semibold mb-4">
          <h2 className="w-full">{heading}</h2>
          {modality && (
            <OrganizationModality modality={modality} className="text-3xl" />
          )}
        </header>

        <Tabs
          defaultActiveKey="1"
          items={tabItems as TabsProps["items"]}
          className="font-century-gothic !text-blue-500 md:!text-lg lg:!text-2xl active:!text-blue-500"
          color="#182F48"
          tabBarStyle={{ color: "#182F48", borderBottom: "1px solid #B7D9E2" }}
        />
      </div>

      {isPremium && (
        <footer className="w-full flex justify-center items-center col-span-6 my-8">
          <Button
            variant="solid-blue"
            className="w-full max-w-xs"
            onClick={() => router.push(`${ROUTES.QUOTES}/${detailsQuery}`)}
          >
            Solicitar Cotización
          </Button>
        </footer>
      )}
    </section>
  );
};

export default ExclusiveAgentDetails;
