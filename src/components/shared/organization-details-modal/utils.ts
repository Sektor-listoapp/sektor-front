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
}: {
  lineOfBusiness?: string[];
  clients?: OrganizationClientType[];
  allies?: PublicOrganizationType[];
  recognitions?: string[];
  workTeam?: OrganizationTeamMemberType[];
  offices?: OrganizationOfficeType[];
  services?: SupplierServiceType[];
  socialMediaLinks?: SocialMediaLinkType[];
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
    Boolean(workTeam?.length) && {
      key: "4",
      label: "Equipo de Trabajo",
      component: "OrganizationWorkTeam",
      children: undefined,
    },
    Boolean(clients?.length) && {
      key: "5",
      label: "Clientes",
      component: "OrganizationClients",
      children: undefined,
    },
    Boolean(allies?.length) && {
      key: "6",
      label: "Aliados",
      component: "OrganizationAllies",
      children: undefined,
    },
    Boolean(recognitions?.length) && {
      key: "7",
      label: "Licencias y Certificaciones",
      component: "OrganizationRecognitions",
      children: undefined,
    },
    Boolean(services?.length) && {
      key: "8",
      label: "Servicios",
      component: "SupplierServices",
      children: undefined,
    },
    Boolean(socialMediaLinks?.length) && {
      key: "9",
      label: "Redes",
      component: "OrganizationSocialMediaLinks",
      children: undefined,
    },
  ];

  return tabItems.filter(Boolean);
};
