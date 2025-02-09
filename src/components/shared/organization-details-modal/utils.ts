import {
  OrganizationClientType,
  OrganizationOfficeType,
  OrganizationTeamMemberType,
  PublicOrganizationType,
  SocialMediaLinkType,
  SupplierServiceType,
} from "@/lib/sektor-api/__generated__/types";

export const getTabItems = ({
  lineOfBusiness,
  clients,
  allies,
  recognitions,
  workTeam,
  offices,
  services,
  socialMediaLinks,
  contactLinks,
  coverageStates,
}: {
  lineOfBusiness?: string[];
  clients?: OrganizationClientType[];
  allies?: PublicOrganizationType[];
  recognitions?: string[];
  workTeam?: OrganizationTeamMemberType[];
  offices?: OrganizationOfficeType[];
  services?: SupplierServiceType[];
  socialMediaLinks?: SocialMediaLinkType[];
  contactLinks?: SocialMediaLinkType[];
  coverageStates?: number[];
}) => {
  const tabItems = [
    Boolean(lineOfBusiness?.length) && {
      key: "1",
      label: "Ramos",
      component: "OrganizationLineOfBusiness",
      children: undefined,
    },
    Boolean(offices?.length) && {
      key: "2",
      label: "Oficinas",
      component: "OrganizationOffices",
      children: undefined,
    },
    Boolean(offices?.length) && {
      key: "3",
      label: "Centros de Atención",
      component: "OrganizationOfficesSlider",
      children: undefined,
    },
    Boolean(coverageStates?.length) && {
      key: "4",
      label: "Oficinas",
      component: "OrganizationCoverageStates",
      children: undefined,
    },
    Boolean(workTeam?.length) && {
      key: "5",
      label: "Equipo de Trabajo",
      component: "OrganizationWorkTeam",
      children: undefined,
    },
    Boolean(clients?.length) && {
      key: "6",
      label: "Clientes",
      component: "OrganizationClients",
      children: undefined,
    },
    Boolean(allies?.length) && {
      key: "7",
      label: "Aliados",
      component: "OrganizationAllies",
      children: undefined,
    },
    Boolean(recognitions?.length) && {
      key: "8",
      label: "Licencias y Certificaciones",
      component: "OrganizationRecognitions",
      children: undefined,
    },
    Boolean(services?.length) && {
      key: "9",
      label: "Servicios",
      component: "SupplierServices",
      children: undefined,
    },
    Boolean(socialMediaLinks?.length) && {
      key: "10",
      label: "Redes",
      component: "OrganizationSocialMediaLinks",
      children: undefined,
    },
    Boolean(contactLinks?.length) && {
      key: "11",
      label: "Contacto",
      component: "OrganizationContactLinks",
      children: undefined,
    },
    Boolean(lineOfBusiness?.length) && {
      key: "12",
      label: "Coberturas",
      component: "OrganizationCoverageLists",
      children: undefined,
    },
  ];

  return tabItems.filter(Boolean);
};
