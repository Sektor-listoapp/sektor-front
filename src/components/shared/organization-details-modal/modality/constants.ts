import { OrganizationModality } from "@/lib/sektor-api/__generated__/types";
import {
  faBuildingCircleCheck,
  faGlobe,
  faHouseLaptop,
} from "@fortawesome/free-solid-svg-icons";

const { Hybrid, Online, Physical } = OrganizationModality;

export const ORGANIZATION_MODALITY_LABEL = {
  [Hybrid]: "Oficina física y online",
  [Online]: "Oficina online",
  [Physical]: "Oficina física",
};

export const ORGANIZATION_MODALITY_ICON = {
  [Hybrid]: faGlobe,
  [Online]: faHouseLaptop,
  [Physical]: faBuildingCircleCheck,
};
