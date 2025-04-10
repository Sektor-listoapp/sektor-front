import { OrganizationLineOfBusiness } from "@/lib/sektor-api/__generated__/types";

const { Health, Auto, Property } = OrganizationLineOfBusiness;

export const SEGMENT_OPTIONS = [
  {
    label: "Ramos",
    value: "",
    disabled: true,
    hidden: true,
  },
  { label: "Salud", value: Health },
  { label: "Automóvil", value: Auto },
  { label: "Patrimoniales", value: Property },
  { label: "Otros", value: "Others" },
];
